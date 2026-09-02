import axios from 'axios'
import { type Readable } from 'node:stream';

export function upload(filename: string, contentStream: Readable) {
  return axios.post('http://localhost:3000', contentStream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-filename': filename
    }
  })
}
