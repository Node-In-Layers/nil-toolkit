import React, { useState, useEffect } from 'react'
import { useNodeInLayersContext } from '../../nil/NodeInLayersContext'

const HealthStatus = () => {
  const [health, setHealth] = useState<string | undefined>('Unknown')
  const [error, setError] = useState<string | undefined>(undefined)
  const [lastChecked, setLastChecked] = useState<Date>(new Date())
  const nilContext = useNodeInLayersContext()

  const _checkHealth = async () => {
    setLastChecked(new Date())
    if (!nilContext.services.sdk.isAuthenticated()) {
      setError('Not authenticated')
      setHealth('Unknown')
      return
    }
    const client = await nilContext.services.sdk.getClient()
    const response = await client.health.getHealth({})
      .catch(() => {
        return {
          error: {
            message: 'Unable to check health'
          }
        }
      })
    if (response.error) {
      setError(response.error.message)
      setHealth('Unknown')
      return
    }
    setHealth(response.status)
    setError(undefined)
    setLastChecked(new Date())
  }

  useEffect(() => {
    let cancelled = false
    const tick = async () => {
      if (!cancelled) {
        await _checkHealth()
      }
    }
    // initial fetch immediately
    tick()
    const id = setInterval(tick, 3000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])
  
  if (!nilContext.loaded) {
    return <div>Loading...</div>
  }
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        maxWidth: 520,
        background: '#ffffff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>Health Status</h2>
        {(() => {
          const value = (health ?? 'Unknown').toString().toLowerCase()
          const isOk = !error && value === 'ok'
          const isUnknown = !error && (value === 'unknown' || !value)
          const badge = isOk
            ? { label: 'OK', color: '#16a34a', bg: '#dcfce7' }
            : isUnknown
              ? { label: 'Unknown', color: '#6b7280', bg: '#e5e7eb' }
              : error
                ? { label: 'Error', color: '#dc2626', bg: '#fee2e2' }
                : { label: (health ?? 'Not OK').toString(), color: '#dc2626', bg: '#fee2e2' }
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 10px',
                borderRadius: 9999,
                background: badge.bg,
                color: badge.color,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: 0.2
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  background: badge.color,
                  boxShadow: `0 0 0 2px ${badge.bg}`
                }}
              />
              {badge.label}
            </span>
          )
        })()}
      </div>

      <div style={{ color: '#374151', fontSize: 14, marginBottom: 8 }}>
        <span style={{ color: '#6b7280' }}>Last checked:</span>{' '}
        <span title={lastChecked.toISOString()}>{lastChecked.toLocaleString()}</span>
      </div>

      {error ? (
        <div style={{ color: '#991b1b', background: '#fee2e2', borderRadius: 8, padding: 12, fontSize: 14 }}>
          {error}
        </div>
      ) : <></>}
    </div>
  )
}

export default HealthStatus