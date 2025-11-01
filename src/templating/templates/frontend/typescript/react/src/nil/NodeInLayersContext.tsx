import React, {createContext, useContext, useEffect, useReducer} from 'react'
import { loadSystem } from '@node-in-layers/core'
import { getConfig } from '../config.js'
import { SystemContext } from '../system/types.js'


const NodeInLayersContext = createContext<SystemContext & { loaded: boolean }>(
  // ts-ignore
  {loaded: false}
)

type UpdateContext = Readonly<{
  type: string,
  payload: SystemContext
}>

const contextReducer = (obj: SystemContext, action: UpdateContext) => {
  switch(action.type) {
    case 'update': {
      return {
        ...action.payload,
        loaded: true
      }
    }
    default: {
      return obj
    }
  }
}

const NodeInLayersContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [context, dispatch] = useReducer(
    contextReducer,
    {loaded: false},
  )
  useEffect(() => {
    _loadContext()
  },[])

  const _loadContext = async () => {
    const config = await getConfig()
    console.log('Config')
    console.log(config)
    const system = await loadSystem({
      environment: import.meta.env.MODE,
      config,
    })
    dispatch({
      type: 'update',
      payload: system,
    })
  }
  return (
    <NodeInLayersContext.Provider value={context}>
      {children}
    </NodeInLayersContext.Provider>
  )
}

const useNodeInLayersContext = () => {
  return useContext(NodeInLayersContext)
}

export {
  NodeInLayersContext,
  NodeInLayersContextProvider,
  useNodeInLayersContext,
}
