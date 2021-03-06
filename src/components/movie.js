import React, { Component }  from 'react';
import {connect} from "react-redux";
import {
    Glyphicon,
    Panel,
    ListGroup,
    ListGroupItem,
    FormGroup,
    Col,
    ControlLabel,
    FormControl,
    Form,
    Button
} from 'react-bootstrap'
import { Image } from 'react-bootstrap'
import { withRouter } from "react-router-dom";
import {fetchMovie, postReview} from "../actions/movieActions";
import PanelBody from "react-bootstrap/lib/PanelBody";
import {submitLogin} from "../actions/authActions";

//support routing by creating a new component

class Movie extends Component {

    constructor(props) {
        super(props);
        this.state = {
            review: {
                name: localStorage.getItem('username'),
                review_quote: '',
                rating: 0,
                movie_ID: this.props.selectedMovie.movie_ID,
            }
        };
        this.handleUpdate = this.handleUpdate.bind(this);
        this.postRev = this.postRev.bind(this);
    }

    handleUpdate(event){
        let updateDetails = Object.assign({}, this.state.review);
        if(event.target.id === "rating"){
            updateDetails[event.target.id] = parseInt(event.target.value);
        }
        else {
            updateDetails[event.target.id] = event.target.value;
        }
        this.setState({
            review: updateDetails
        });
        console.log(this.state.review);
    }

    postRev(){
        const {dispatch} = this.props;
        dispatch(postReview(this.state.review));
    }

    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null) {
            dispatch(fetchMovie(this.props.movieId));
        }
    }

    render() {
        const ActorInfo = ({actors, characters}) => {
            return actors.map((actor, i) =>
                <p key={i}>
                    <b>{actor}</b> {characters[i]}
                </p>
            )
        }

        const ReviewInfo = ({reviews}) => {
            return reviews.map((review, i) =>
                <p key={i}>
                    <b>{review.name}</b> {review.review_quote}
                    <Glyphicon glyph={'star'} /> {review.rating}
                </p>

            )
        }

        const ReviewField = ({reviews}) =>{
            return(
                <Form horizontal>
                    <FormGroup controlId="review_quote">
                        <Col componentClass={ControlLabel} sm={2}>
                            Leave a review
                        </Col>
                        <Col sm={10}>
                            <FormControl autoFocus onChange={this.handleUpdate} value={this.state.review.review_quote} type="text" placeholder="Leave a review" />
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="rating">
                        <Col componentClass={ControlLabel} sm={2}>
                            Leave a rating out of 5 stars
                        </Col>
                        <Col sm={10}>
                        <FormControl onChange={this.handleUpdate} value={this.state.review.rating} componentClass="select">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </FormControl>
                        <Button onClick={this.postRev}> Submit Review </Button>
                        </Col>
                    </FormGroup>
                </Form>
            )
        }

        const DetailInfo = ({currentMovie}) => {
            if (!currentMovie) { //if not could still be fetching the movie
                return <div>Loading...</div>;
            }
            return (
              <Panel>
                  <Panel.Heading>Movie Detail</Panel.Heading>
                  <Panel.Body><Image className="image" src={currentMovie.movie_URL} thumbnail /></Panel.Body>
                  <ListGroup>
                      <ListGroupItem>{currentMovie.title}</ListGroupItem>
                      <ListGroupItem><ActorInfo actors={currentMovie.actor_name} characters={currentMovie.character_name}/></ListGroupItem>
                      <ListGroupItem><h4><Glyphicon glyph={'star'}/> {currentMovie.average_rating} </h4></ListGroupItem>
                  </ListGroup>
                  <Panel.Body><ReviewInfo reviews={currentMovie.reviews} /></Panel.Body>
                  <Panel.Body><ReviewField /></Panel.Body>
              </Panel>
            );
        }

        return (
            <DetailInfo currentMovie={this.props.selectedMovie} />
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(ownProps);
    return {
        selectedMovie: state.movie.selectedMovie,
        movieId: ownProps.match.params.movieId
    }
}

export default withRouter(connect(mapStateToProps)(Movie));