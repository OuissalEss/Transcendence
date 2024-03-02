// pages/404.js
import Image from 'next/image';

export default function Custom404() {
  return (
    <div class="container404">
    <div class="left404">
      <Image src="/Stitch.png" alt="Character Picture"
         width={1000} height={1000} />
    </div>
    <div class="right404">
      <h1>404 Not Found</h1>
      <h2>Someone ate the page!</h2>
      <h2>or for some other reason, the page you're looking for cannot be located. Just in case, please check the URL.</h2>
    </div>
  </div>
  )
}