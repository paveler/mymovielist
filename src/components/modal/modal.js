import React, { useState, useEffect } from 'react'
import Directual from 'directual-api';
import { Loader } from '../loader/loader';
import { useAuth } from '../../auth'
import './modal.css'

export function Modal(props) {

    const api = new Directual({ apiHost: '/' })

    let dataStructure = 'movies'
    let endpoint = 'rateMovies'

    const auth = useAuth();

    const [response, setResponse] = useState(); // API response
    const [status, setStatus] = useState(); // Request status
    const [badRequest, setBadRequest] = useState(); // API error message
    const [loading, setLoading] = useState(false); // Loader
    const [formPayload, setFormPayload] = useState(); // Data to send. Here we can add userID: auth.user by default
    const [sent, setSent] = useState(false)

    // POST-request
    function postData() {
        setLoading(true)
        api
            // Data structure
            .structure(dataStructure)
            // POST request + payload + query params:
            .setData(endpoint, {...formPayload, 'is_watched': true, 'id': props.movie.id },
                { sessionID: auth.sessionID })
            .then((response) => {
                setResponse(response.result)
                setStatus(response.status)
                setLoading(false)
                setSent(true)
                props.handleReload()
            })
            .catch((e) => {
                // handling errors
                setLoading(false)
                console.log(e.response)
                setBadRequest({
                    httpCode: e.response.status,
                    msg: e.response.data.msg
                })
            })
    }

    const [rating, setRating] = useState(0)
    return (
        <div className="modal-window">
            <div className="poster"
                style={
                    {
                        backgroundImage: `url(${props.movie.poster})`
                    }
                }
            ></div>
            <div className="movie-info">
                <h2>{props.movie.title}</h2>
                <p className="movie-year">{props.movie.year}</p>
                <p className="imdb-rating"><span>IMDB:</span> {props.movie.imbd_rating}</p>
                <p><span>Director:</span> {props.movie.director}</p>
                <p><span>Actors:</span> {props.movie.actors}</p>
                <p><span>Plot:</span> {props.movie.plot}</p>

                {props.movie.my_rating &&
                    <div className="stars">
                        <div>My rating:</div>
                        {(props.movie.my_rating == 1) && <span>⭐</span>}
                        {(props.movie.my_rating == 2) && <span>⭐⭐</span>}
                        {(props.movie.my_rating == 3) && <span>⭐⭐⭐</span>}
                        {(props.movie.my_rating == 4) && <span>⭐⭐⭐⭐</span>}
                        {(props.movie.my_rating == 5) && <span>⭐⭐⭐⭐⭐</span>}
                    </div>
                }
                {loading && <Loader />}
                {sent && <p class="hint">OK, the movie has been rated!</p>}

                {auth.isAutorised() && !auth.hasRole('admin') && !props.movie.is_watched &&
                <p class="hint">Only the List ownder can rate the movie</p>}

                {!props.movie.is_watched && !loading && !sent && auth.hasRole('admin') &&
                    <div className="rate-this">
                        <p>{(rating == 0) && <div>Rate this movie:</div>}</p>
                        <p>{(rating == 1) && <div>Awful!</div>}</p>
                        <p>{(rating == 2) && <div>Bad</div>}</p>
                        <p>{(rating == 3) && <div>Acceptable</div>}</p>
                        <p>{(rating == 4) && <div>Good</div>}</p>
                        <p>{(rating == 5) && <div>Wonderful!</div>}</p>
                        <div className="stars-wrapper">
                            <span
                                className={`star ${(rating >= 1) && 'active'}`}
                                onMouseEnter={() => {setRating(1); setFormPayload({'my_rating': 1})}}
                                onMouseLeave={() => setRating(0)}
                                onClick={postData}
                            >
                                ⭐
                            </span>
                            <span
                                className={`star ${(rating >= 2) && 'active'}`}
                                onMouseEnter={() => {setRating(2); setFormPayload({'my_rating': 2})}}
                                onMouseLeave={() => setRating(0)}
                                onClick={postData}
                            >
                                ⭐
                            </span>
                            <span
                                className={`star ${(rating >= 3) && 'active'}`}
                                onMouseEnter={() => {setRating(3); setFormPayload({'my_rating': 3})}}
                                onMouseLeave={() => setRating(0)}
                                onClick={postData}
                            >
                                ⭐
                            </span>
                            <span
                                className={`star ${(rating >= 4) && 'active'}`}
                                onMouseEnter={() => {setRating(4); setFormPayload({'my_rating': 4})}}
                                onMouseLeave={() => setRating(0)}
                                onClick={postData}
                            >
                                ⭐
                            </span>
                            <span
                                className={`star ${(rating == 5) && 'active'}`}
                                onMouseEnter={() => {setRating(5); setFormPayload({'my_rating': 5})}}
                                onMouseLeave={() => setRating(0)}
                                onClick={postData}
                            >
                                ⭐
                            </span>
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}