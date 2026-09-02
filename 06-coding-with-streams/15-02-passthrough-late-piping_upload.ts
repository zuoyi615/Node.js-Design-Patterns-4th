import axios from 'axios'
import { PassThrough } from 'node:stream';

export function createUploadStream(filename: string): PassThrough {
  const connector = new PassThrough()

  axios.post('http://localhost:3000', connector, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-filename': filename
    }
  })

  return connector
}

/**
 * NOTE: Pattern
 * Use a `PassThrough` stream when you need to provide a placeholder
 * for data that will be read or written in the future
 */
