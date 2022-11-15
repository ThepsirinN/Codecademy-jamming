const clientID = ''
const redirectURI = 'http://localhost:3000/'

let uat
let expTime

const Spotify = {
    getAccessToken() {
        //uat = localStorage.getItem('UAT') ? localStorage.getItem('UAT') : ''
        uat = document.cookie.split('=')[1] ? document.cookie.split('=')[1] : ''
        if(uat){
            return 
        }

        const uatMatch = window.location.href.match(/access_token=([^&]*)/)
        const experiedMatch = window.location.href.match(/expires_in=([^&]*)/)

        if(uatMatch && experiedMatch){
            // will match 2 element 0 => access_token=NwAExz...BV3O2Tk, 1 => NwAExz...BV3O2Tk 
            uat = uatMatch[1]
            //localStorage.setItem('UAT',uat)
            const d = new Date()
            expTime = experiedMatch[1]
            d.setTime(d.getTime() + (+expTime*1000));
            let expires = "expires="+d.toUTCString();
            document.cookie = 'UAT=' + uat + ";" + expires + ";path=/";
            window.setTimeout(()=>{ uat = '';localStorage.setItem('UAT', '')}, +expTime * 1000)
            // for push state of the back button to the same url
            // This clears the parameters, allowing us to grab a new access token when it expires. // from AmarNathH
            // clear following url path
            window.history.pushState('Access Token', null, '/');
        }else{
            window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
        }
    },

    search(term){
        // set localstorage for searchterm use for after refresh
        let searchTerm = localStorage.getItem('searchTerm') === term ? localStorage.getItem('searchTerm') : term
        localStorage.setItem('searchTerm',term)
        // call get access token
        this.getAccessToken()

        let searchData = fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm.length !== 0 ? searchTerm : 'default'}`, {
            headers: {Authorization: `Bearer ${uat}`}
        })
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            if(!data){
                return []
            }
            let track = data.tracks.items.map(element=>{
                return {
                    id : element.id,
                    name : element.name,
                    artist : element.artists[0].name, // Primary Artist
                    album : element.album.name,
                    uri : element.uri
                }
            })
            return track
        })
        .catch((e)=>{
            console.log(e)
        })
        // promise return
        return searchData
    },

    async savePlaylist(playlistName, trackURIs){
        if(!(playlistName && trackURIs)){
            return
        }
        const userId = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${uat}`,
            'Content-Type': 'application/json'
            }
        })
        .then((response)=>{
            return response.json()
        })
        .then((jsonData)=>{
            return jsonData.id
        })
        .catch((e)=>{
            console.log(e)
        })

        const playlistPostNameId = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: {
                Authorization: `Bearer ${uat}`,
            'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                name: playlistName,
                description: "New playlist description",
            })
        })
        .then((response)=>{
            return response.json()
        })
        .then((jsonData)=>{
            return jsonData.id
        })
        .catch((e)=>{
            console.log(e)
        })

        return await fetch(`https://api.spotify.com/v1/playlists/${playlistPostNameId}/tracks`, {
            headers: {
                Authorization: `Bearer ${uat}`,
            'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                uris: trackURIs,
            })
        })
        .then((response)=>{
            return response.json()
        })
        .then((jsonData)=>{
            return true
        })
        .catch((e)=>{
            console.log(e)
            return false
        })

    }
}

export default Spotify