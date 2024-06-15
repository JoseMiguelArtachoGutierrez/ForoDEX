import { Link } from 'react-router-dom';

function Footer() {

    return (
        <footer className='footer'>

                <Link to="/" className="logo"><div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 48 48"><path fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" d="M26.844 17.673c1.813 1.015 3.909 1.155 6.379.816"/><path fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" d="M5.66 35.21c1.03-1.34 2.31-2.51 3.84-3.39c.97-.57 2.03-1.02 3.19-1.33c-2.6-2.84-3.94-15.92 6.03-16.42h.01c.19-.01.38-.01.58-.01c3.13 0 4.69 1.18 4.69 1.18s1.56-1.18 4.69-1.18c.2 0 .39 0 .58.01h.01c9.97.5 8.63 13.58 6.03 16.42c1.16.31 2.22.76 3.19 1.33c1.53.88 2.81 2.05 3.84 3.39"/><path fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" d="M21.156 17.673c-1.813 1.015-3.909 1.155-6.379.816m6.513 3.869s.273-1.218-.417-1.92c0 0-.906.441-1.27 1.416c1.202.713 2.664.793 4.397.793s3.195-.08 4.396-.793c-.362-.975-1.269-1.417-1.269-1.417c-.69.703-.417 1.921-.417 1.921"/><path fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" d="M4.19 32.37c2.53-1.22 5.31-.55 5.31-.55s-1.66-4.88-.46-11.38c-.52-5.96.28-7.91.93-8.35c.68-.45 4.93-.18 8.75 1.98h.01c1.8-.92 3.66-1.46 5.27-1.46s3.47.54 5.27 1.46h.01c3.82-2.16 8.07-2.43 8.75-1.98c.65.44 1.45 2.39.93 8.35c1.2 6.5-.46 11.38-.46 11.38s2.78-.67 5.31.55"/><circle cx="24" cy="24" r="21.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div></Link>

            <div>
                <p>
                    © 2024 ForoDEX - Todos los derechos reservados
                </p>
                <div>
                    <p>Social media: </p>
                    <div>
                        <a href='https://www.facebook.com/' target='_blank'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16"><path fill="#ffffff" d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131c.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/></svg>
                        </a>
                        <a href='https://www.x.com' target='_blank'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="#ffffff" d="M8.5 2h2.5L11 2h-2.5zM13 2h2.5L15.5 2h-2.5zM10.5 2h5v0h-5zM8.5 2h5v0h-5zM10 2h3.5L13.5 2h-3.5z"><animate fill="freeze" attributeName="d" dur="0.8s" keyTimes="0;0.3;0.5;1" values="M8.5 2h2.5L11 2h-2.5zM13 2h2.5L15.5 2h-2.5zM10.5 2h5v0h-5zM8.5 2h5v0h-5zM10 2h3.5L13.5 2h-3.5z;M8.5 2h2.5L11 22h-2.5zM13 2h2.5L15.5 22h-2.5zM10.5 2h5v2h-5zM8.5 20h5v2h-5zM10 2h3.5L13.5 22h-3.5z;M8.5 2h2.5L11 22h-2.5zM13 2h2.5L15.5 22h-2.5zM10.5 2h5v2h-5zM8.5 20h5v2h-5zM10 2h3.5L13.5 22h-3.5z;M1 2h2.5L18.5 22h-2.5zM5.5 2h2.5L23 22h-2.5zM3 2h5v2h-5zM16 20h5v2h-5zM18.5 2h3.5L5 22h-3.5z"/></path></svg>
                        </a>
                        <a href='https://www.twitch.tv' target='_blank'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 256 256"><path fill="#ffffff" d="M208 28H48a20 20 0 0 0-20 20v144a20 20 0 0 0 20 20h12v28a12 12 0 0 0 19.68 9.22L124.34 212h40.76a20.06 20.06 0 0 0 12.81-4.64l42.89-35.74a19.93 19.93 0 0 0 7.2-15.37V48a20 20 0 0 0-20-20m-4 126.38L163.66 188H120a12 12 0 0 0-7.68 2.78L84 214.38V200a12 12 0 0 0-12-12H52V52h152ZM156 136V88a12 12 0 0 1 24 0v48a12 12 0 0 1-24 0m-48 0V88a12 12 0 0 1 24 0v48a12 12 0 0 1-24 0"/></svg>
                        </a>
                        <a href='https://www.pinterest.es' target='_blank'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><defs><path id="IconifyId18fe9d0f04a6515100" fill="#fff" d="M0 0h24v24H0z"/></defs><g fill="none"><g clipPath="url(#IconifyId18fe9d0f04a6515101)"><g clipPath="url(#IconifyId18fe9d0f04a6515102)"><path fill="#ffffff" d="M0 12c0 5.123 3.211 9.497 7.73 11.218c-.11-.937-.227-2.482.025-3.566c.217-.932 1.401-5.938 1.401-5.938s-.357-.715-.357-1.774c0-1.66.962-2.9 2.161-2.9c1.02 0 1.512.765 1.512 1.682c0 1.025-.653 2.557-.99 3.978c-.281 1.189.597 2.159 1.769 2.159c2.123 0 3.756-2.239 3.756-5.471c0-2.861-2.056-4.86-4.991-4.86c-3.398 0-5.393 2.549-5.393 5.184c0 1.027.395 2.127.889 2.726a.36.36 0 0 1 .083.343c-.091.378-.293 1.189-.332 1.355c-.053.218-.173.265-.4.159c-1.492-.694-2.424-2.875-2.424-4.627c0-3.769 2.737-7.229 7.892-7.229c4.144 0 7.365 2.953 7.365 6.899c0 4.117-2.595 7.431-6.199 7.431c-1.211 0-2.348-.63-2.738-1.373c0 0-.599 2.282-.744 2.84c-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0S0 5.373 0 12"/></g></g><defs><clipPath id="IconifyId18fe9d0f04a6515101"><use href="#IconifyId18fe9d0f04a6515100"/></clipPath><clipPath id="IconifyId18fe9d0f04a6515102"><use href="#IconifyId18fe9d0f04a6515100"/></clipPath></defs></g></svg>
                        </a>
                    </div>
                </div>
                
            </div>
        </footer>
    )
}
export default Footer