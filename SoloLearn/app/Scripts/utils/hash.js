import hmacsha1 from 'hmacsha1';

export default pass => hmacsha1('password', pass).slice(0, -1);