import {createContext, useContext, useEffect, useReducer} from 'react'
import { loadSystem } from '@node-in-layers/core/index.js'
import { default as configFunc } from './config.dev.js'


const NodeInLayersContext = createContext({})

type UpdateContext = Readonly<{
  type: string,
  payload: object
}>

const contextReducer = (obj, action: UpdateContext) => {
  switch(action.type) {
    case 'update': {
      return action.payload
    }
    default: {
      return obj
    }
  }
}

const NodeInLayersContextProvider = ({ children }) => {
  const [context, dispatch] = useReducer(
    contextReducer,
    {},
  )
  useEffect(() => {
    _loadContext()
  },[])

  const _loadContext = async () => {
    const config = await configFunc()
    const system = await loadSystem({
      environment: import.meta.env.MODE,
      config,
      nodeOverrides: { fs: {}},
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
