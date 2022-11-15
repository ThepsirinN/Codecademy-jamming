import React from 'react'
import './Playlist.css'
import TrackList from '../TrackList/TrackList'

class Playlist extends React.Component {
    constructor(props){
        super(props)
        this.handleNameChange = this.handleNameChange.bind(this)
    }

    handleNameChange(e){
        // this.props.onNameChange is from App cpn
        // this will losing scope if we not bind
        this.props.onNameChange(e.target.value)
    }

    render(){
        // this.props.playlistTracks and this.props.playlistName are from App cpn
        // this.props.onRemove is from App cpn
        // this.props.onSave is from App cpn
        return(
            <div className="Playlist">
                <input value={ this.props.playlistName || '' } placeholder='Enter Playlist Name' onChange= { this.handleNameChange } />
                <TrackList tracks={ this.props.playlistTracks } onRemove={ this.props.onRemove } isRemoval={ true } />
                <button className="Playlist-save" onClick={ this.props.onSave }>SAVE TO SPOTIFY</button>
            </div>
        )
    }
}

export default Playlist