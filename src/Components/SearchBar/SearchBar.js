import React from 'react'
import './SearchBar.css'

class SearchBar extends React.Component {
    constructor(props){
        super(props)
        // set term state to '' or local storege
        this.state = { term:''}
        this.search = this.search.bind(this)
        this.handleTermChange = this.handleTermChange.bind(this)
    }

    search(){
        this.props.onSearch(this.state.term)
    }

    handleTermChange(e){
        this.setState({ term: e.target.value })
    }
    
    componentDidMount(){
        this.setState({ term: localStorage.getItem('searchTerm') ? localStorage.getItem('searchTerm') : '' })
    }

    render(){
        return(
            <div className="SearchBar">
                {/* set default input value */}
                <input placeholder="Enter A Song, Album, or Artist" onChange={ this.handleTermChange } value={this.state.term}/> 
                <button className="SearchButton" onClick={this.search} >SEARCH</button>
            </div>
        )
    }
}

export default SearchBar