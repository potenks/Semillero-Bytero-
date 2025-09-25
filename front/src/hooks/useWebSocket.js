import { useEffect, useRef } from 'react'

export function useWebSocket(url, onMessage) {
  const wsRef = useRef(null)
  const reconnectRef = useRef(null)
  const shouldReconnectRef = useRef(true)
  useEffect(() => {
    function connect() {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        // console.log('[WS] connected', url)
      }

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data)
          onMessage?.(data)
        } catch (err) {
          // console.warn('WS message parse error', err)
        }
      }

      const scheduleReconnect = () => {
        if (!shouldReconnectRef.current) return
        reconnectRef.current = setTimeout(connect, 2000)
      }

      ws.onclose = scheduleReconnect
      ws.onerror = scheduleReconnect
    }

    shouldReconnectRef.current = true
    connect()

    return () => {
      shouldReconnectRef.current = false
      if (reconnectRef.current) clearTimeout(reconnectRef.current)
      wsRef.current?.close()
    }
  }, [url, onMessage])
}

