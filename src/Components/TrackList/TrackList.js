import React from 'react'
import './TrackList.css'
import Track from '../Track/Track'

class TrackList extends React.Component {
    render(){
        // this.props.onAdd is from SearchResults CPN
        // this.props.onRemove is from Playlist cpn
        // this.props.isRemoval is from Playlist cpn and also SearchResults cpn
        return(
            <div className="TrackList">
                { this.props.tracks.map((track)=>{
                    return (
                        <Track key={ track.id } track={ track } onAdd={ this.props.onAdd }  onRemove={ this.props.onRemove } isRemoval={ this.props.isRemoval } />
                    )
                })}
            </div>
        )
    }
}

export default TrackList