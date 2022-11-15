import React from 'react'
import Swal from 'sweetalert2';
import './App.css'
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = { 
      SearchResults:[],
      playlistName: '',
      playlistTracks: [],
     }
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }

  addTrack(track){
    if(!(this.state.playlistTracks.find((element)=>{
      return track.id === element.id
    }))){

      let initialStateArr = this.state.playlistTracks
      initialStateArr.push(track)
      this.setState({ playlistTracks: initialStateArr })
    }
  }

  removeTrack(track){
    let ArrRm = this.state.playlistTracks.filter((element)=>{
      return track.id !== element.id
    })
    this.setState({ playlistTracks: ArrRm })
  }

  updatePlaylistName(name){
    this.setState({ playlistName: name })
  }

  savePlaylist(){
    let playlistName = this.state.playlistName ? this.state.playlistName : 'Default Playlist'
    let trackURIs = this.state.playlistTracks.map((track)=>{
      return `spotify:track:${track.id}`
    })
    let status = Spotify.savePlaylist(playlistName,trackURIs)
    if(status){
      Swal.fire({
        title: '<strong>Good job!</strong>',
        html: '<p>Create playlist successful</p>',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      this.setState({
        playlistName: '',
      playlistTracks: []
    })
    }else{
      Swal.fire({
        title: '<strong>Error!</strong>',
        html: '<p>Create playlist <u>Not</u> successful</p>',
        icon: 'error',
        cancelButtonText: 'OK'
      })
    }
  }

  search(term){
    Spotify.search(term)
    .then((searchData)=>{
      this.setState({SearchResults : searchData})
    })
  }

  componentDidMount(){
    const uatMatch = window.location.href.match(/access_token=([^&]*)/)
    const experiedMatch = window.location.href.match(/expires_in=([^&]*)/)
    if(uatMatch && experiedMatch){
      Spotify.getAccessToken()
      if(localStorage.getItem('searchTerm')!== ''){
        this.search(localStorage.getItem('searchTerm'))
      }
      return
    }
    // for search value if we close tab set to empty str
    localStorage.removeItem("searchTerm")
  }

  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={ this.search } />
          <div className="App-playlist">
            <SearchResults SearchResults={ this.state.SearchResults } onAdd={ this.addTrack } />
            <Playlist playlistName={ this.state.playlistName } playlistTracks={ this.state.playlistTracks } onRemove={ this.removeTrack } onNameChange={ this.updatePlaylistName } onSave={ this.savePlaylist }/>
          </div>
        </div>
      </div>
    )
  }
}

export default App