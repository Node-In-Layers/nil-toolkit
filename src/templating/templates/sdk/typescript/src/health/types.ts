import { JsonAble, JsonObj } from 'functional-models'
import {
  annotationFunctionProps,
  NilAnnotatedFunction,
} from '@node-in-layers/core'
import { z } from 'zod'

export type HealthCheckResponse = Readonly<{
  status: string
  details?: JsonAble
}>

// If you need additional services for checking health, put them here.
export type HealthServices = Readonly<object>

export type HealthServicesLayer = Readonly<{
  health: HealthServices
}>

export const getHealthProps = annotationFunctionProps<
  JsonObj,
  HealthCheckResponse
>({
  functionName: 'getHealth',
  domain: 'health',
  description: 'Simple health check to see if the backend is reachable.',
  args: z.object({}),
  returns: z.object({ status: z.string(), details: z.any().optional() }),
})

export type HealthFeatures = Readonly<{
  getHealth: NilAnnotatedFunction<JsonObj, HealthCheckResponse>
}>

export type HealthFeaturesLayer = Readonly<{
  health: HealthFeatures
}>
