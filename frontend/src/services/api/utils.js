import {
  validateRequestData,
  validateResponseData,
} from './dataIntegration/validation';
import { mapRequestData, mapResponseData } from './dataIntegration/mapper';

export async function processRequestData(operation, frontendData) {
  try {
    const validatedData = await validateRequestData(operation, frontendData);
    const processedRequest = mapRequestData(operation, validatedData);
    return processedRequest;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function processResponseData(operation, backendData) {
  try {
    const validatedData = await validateResponseData(operation, backendData);
    const processedResponse = mapResponseData(operation, validatedData);
    console.log(processedResponse);
    return processedResponse;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
