import React from 'react'
import { CoreNamespace } from '@node-in-layers/core'
import { useNodeInLayersContext } from '../../nil/NodeInLayersContext.tsx'

const Home = () => {
  const nilContext = useNodeInLayersContext()
  if (!nilContext.loaded) {
    return (<></>)
  }

  const domains = (nilContext.config[CoreNamespace.root].domains ?? []).map((a: { name: string }) => a.name)
  type LayerMap = Record<string, Record<string, unknown>>
  const featuresMap: LayerMap = (nilContext.features ?? {}) as unknown as LayerMap
  const servicesMap: LayerMap = (nilContext.services ?? {}) as unknown as LayerMap

  const primaryColor = '#314730'

  const containerStyle: React.CSSProperties = {
    maxWidth: 900,
    margin: '0 auto',
    padding: 24,
    fontFamily: 'Lato, sans-serif',
    color: '#111827',
    lineHeight: 1.5,
  }
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 12,
    marginBottom: 28,
  }
  const titleStyle: React.CSSProperties = {
    fontSize: 40,
    margin: 0,
    color: '#111827',
    fontWeight: 800,
  }
  const subtitleStyle: React.CSSProperties = {
    margin: 0,
    color: '#6b7280',
    fontSize: 18,
  }
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  }
  const cardStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: 0,
    padding: 0,
    background: 'transparent',
    boxShadow: 'none',
  }
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 18,
    margin: '0 0 8px 0',
    color: '#111827',
    fontWeight: 700,
  }
  const listStyle: React.CSSProperties = {
    margin: 0,
    paddingLeft: 18,
  }
  const mutedStyle: React.CSSProperties = {
    color: '#6b7280',
    margin: 0,
  }
  const cardSectionStyle: React.CSSProperties = {
    marginBottom: 16,
  }
  const listPaddedStyle: React.CSSProperties = {
    margin: 0,
    paddingLeft: 18,
  }
  const listItemMarginStyle: React.CSSProperties = {
    marginBottom: 8,
  }
  const groupMarginStyle: React.CSSProperties = {
    marginBottom: 8,
  }
  const actionsRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    marginTop: 8,
  }
  const buttonPrimaryStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '8px 14px',
    borderRadius: 8,
    background: primaryColor,
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: 700,
  }

  if (!nilContext?.config) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Node in Layers</h1>
        <p style={mutedStyle}>Loading system configuration…</p>
      </div>
    )
  }

  return (
    <>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>Node in Layers</h1>
          <p style={subtitleStyle}>A layered, domain-first way to organize systems. This template wires a small React app to load your system, then exposes its config, features, and services via a simple context.</p>
          <div style={actionsRowStyle}>
            <a href='https://github.com/Node-In-Layers/nil-core' target='_blank' rel='noreferrer' style={buttonPrimaryStyle}>GitHub (Core)</a>
          </div>
        </header>
        <section style={cardSectionStyle}>
          <h2 style={sectionTitleStyle}>How to update the system</h2>
          <ol style={listPaddedStyle}>
            <li style={listItemMarginStyle}>
              Add new domains in <code>src/config.ts</code> by appending them to the <code>domains</code> list.
            </li>
            <li style={listItemMarginStyle}>
              Use the hook <code>useNodeInLayersContext()</code> to access <code>config</code>, <code>features</code>, and <code>services</code> anywhere in the system.
            </li>
            <li>
              Creating a domain follows the same structure as any other Node in Layers system.
            </li>
          </ol>
        </section>

        <section style={cardSectionStyle}>
          <h2 style={sectionTitleStyle}>Loaded Domains</h2>
          {domains.length === 0 ? (
            <p style={mutedStyle}>No domains were discovered.</p>
          ) : (
            <ul style={listStyle}>
              {domains.map(name => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          )}
        </section>

        <section style={gridStyle}>
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>Features</h3>
            {Object.keys(featuresMap).length === 0 ? (
              <p style={mutedStyle}>No features loaded.</p>
            ) : (
              <div>
                {Object.keys(featuresMap).map(domain => (
                  <div key={domain} style={groupMarginStyle}>
                    <strong>{domain}</strong>
                    <ul style={listStyle}>
                      {Object.keys(featuresMap?.[domain] ?? {}).length === 0 ? (
                        <li style={mutedStyle as React.CSSProperties}>—</li>
                      ) : (
                        Object.keys(featuresMap?.[domain] ?? {}).map((fname: string) => (
                          <li key={fname}>{fname}</li>
                        ))
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>Services</h3>
            {Object.keys(servicesMap).length === 0 ? (
              <p style={mutedStyle}>No services loaded.</p>
            ) : (
              <div>
                {Object.keys(servicesMap).map(domain => (
                  <div key={domain} style={groupMarginStyle}>
                    <strong>{domain}</strong>
                    <ul style={listStyle}>
                      {Object.keys(servicesMap?.[domain] ?? {}).length === 0 ? (
                        <li style={mutedStyle as React.CSSProperties}>—</li>
                      ) : (
                        Object.keys(servicesMap?.[domain] ?? {}).map((sname: string) => (
                          <li key={sname}>{sname}</li>
                        ))
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
