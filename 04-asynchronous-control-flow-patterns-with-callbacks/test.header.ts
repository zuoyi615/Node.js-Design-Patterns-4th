import { get } from './utils.ts';

get('https://nodejsdesignpatterns.com/blog/123', (err) => {
  if (err) {
    console.log(err.code)
  }
})
