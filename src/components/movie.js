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
import {fetchMovie} from "../actions/movieActions";
import PanelBody from "react-bootstrap/lib/PanelBody";

//support routing by creating a new component

class Movie extends Component {

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
                    <FormGroup controlId="reviewToPost">
                        <Col componentClass={ControlLabel} sm={2}>
                            Leave a review
                        </Col>
                        <Col sm={10}>
                            <FormControl type="email" placeholder="Leave a review" />
                            <FormControl type="email" placeholder="# out of 5" />
                            <FormControl as="select"> </FormControl>
                            <Button > Submit Review </Button>
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