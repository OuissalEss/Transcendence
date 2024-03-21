// pages/404.js
import Image from 'next/image';

export default function Custom404() {
  return (
    <div className="container404">
    <div className="left404">
      <Image
         src="/Stitch.png"
         alt="Character Picture"
         style={{ width: '100%', height: 'auto'}}
         width={1000}
         height={1000}
         priority
      />
    </div>
    <div className="right404">
      <h1>404 Not Found</h1>
      <h2>Someone ate the page!</h2>
      <h2>or for some other reason, the page you&apos;re looking for cannot be located. Just in case, please check the URL.</h2>
    </div>
  </div>
  )
}