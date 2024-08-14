function Header(){

    return(
        <>
        <div className="container" style={{flexDirection:"column"}}>
            <img src="./img/home-logo-500px.jpg" alt="Ronald McDonald House" />
            <p className="headertext">Ronald McDonald House Ottawa</p>
        </div>
        <div className="container">
            <div className="yt-cont">
            <iframe width="90%" height="90%" src="https://www.youtube.com/embed/el8EMBwD5Qc?si=wADJNYTtJ13seBQs&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        </div>
        </>
    )
}

export default Header