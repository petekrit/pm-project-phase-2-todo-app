import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get('http://13.211.147.74:3000/');
  sleep(1);
}
