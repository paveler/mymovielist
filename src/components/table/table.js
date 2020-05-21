import React, { useEffect, useState } from 'react'
import Directual from 'directual-api';
import { useAuth } from '../../auth'
import { Loader } from '../loader/loader';
import './table.css'
import { Dropdown } from '../dropdown/dropdown'
import { Modal } from '../modal/modal'

// Example of getting data from Directual

// Connect to Directual api
const api = new Directual({ apiHost: '/' })

export function Table(props) {

    // API-endpoint details
    const dataStructure = props.dataStructure // todo: write here sysname of your data structure
    const endpoint = props.endpoint // todo: write here Method name of your API-endpoint

    // connect authentication context
    const auth = useAuth();

    // Hooks for handling state
    const [payload, setPayload] = useState([]); // API response
    const [pageInfo, setPageInfo] = useState({}); // API response metadata, e.g. number of objects
    const [loading, setLoading] = useState(true); // initial loader
    const [badRequest, setBadRequest] = useState(); // API error message
    const [pageLoading, setPageLoading] = useState(false); // paging loader
    const [pageNum, setPageNum] = useState(0); // Page number, by default = 0
    const [pageSize, setPageSize] = useState(props.pageSize || 10); // Page size, bu default = 10
    const [sortOption, setSortOption] = useState('@dateChanged,desc')
    const [modalWindow, setModalWindow] = useState();

    // Paging
    useEffect(() => {
        setPageLoading(true)
        getData()
    }, [pageNum])

    useEffect(() => {
        setPageLoading(true)
        getData()
    }, [sortOption])

    // useEffect(() => {
    //     getData()
    // })

    const handleReload = () => {
        getData()
    }

    const nextPage = () => {
        setPageLoading(true)
        setPageNum(pageNum + 1)
    }
    const prevPage = () => {
        setPageLoading(true)
        setPageNum(pageNum - 1)
    }

    // GET-request
    function getData() {
        console.log('requesting...')

        api
            // Data structure
            .structure(props.dataStructure)
            // GET request + query params (sessionID, page, pageSize by default)
            .getData(props.endpoint, {
                sessionID: auth.sessionID, page: pageNum,
                pageSize: pageSize, sort: sortOption
            })
            // other possible query params:
            // {{HttpRequest}} — any param for Filtering
            // sort=FIELD_SYSNAME_1,desc,FIELD_SYSNAME_2,asc — sorting with multiple params
            .then((response) => {
                setPayload(response.payload)
                setPageInfo(response.pageInfo)
                setLoading(false)
                setPageLoading(false)
            })
            .catch((e) => {
                // handling errors
                setLoading(false)
                setPageLoading(false)
                console.log(e.response)
                setBadRequest(e.response.status + ', ' + e.response.data.msg)
            })
    }


    return (
        <div>
            <div className="table-sorting">
                <div className={`sort-option ${(sortOption == '@dateChanged,desc') && 'active'}`}
                    onClick={() => setSortOption('@dateChanged,desc')}>Date changed</div>
                {props.watched && <div
                    className={`sort-option ${(sortOption == 'my_rating,desc') && 'active'}`}
                    onClick={() => setSortOption('my_rating,desc')}>My rating</div>}
                <div
                    className={`sort-option ${(sortOption == 'imbd_rating,desc') && 'active'}`}
                    onClick={() => setSortOption('imbd_rating,desc')}>IMBD rating</div>
            </div>

            {loading && <Loader />}
            {payload && !loading &&
                <div>
                    <div className="movies-table">
                        <span className="total">Movies: {pageInfo.tableSize}</span>
                        <table>
                            <thead>
                                <tr>
                                    <td></td>
                                    <td>Title</td>
                                    <td>Director</td>
                                    <td>Actors</td>
                                    <td>IMDB rating</td>
                                    <td>Who recommended</td>
                                    {props.watched &&
                                        <td>My rating</td>}
                                </tr>
                            </thead>
                            <tbody>
                                {payload.map(row =>
                                    <tr>
                                        <td><img src={row.poster} class="small-poster" /></td>
                                        <td>
                                            <a onClick={() => setModalWindow(row.id)}>{row.title}</a> ({row.year})
                                            {(modalWindow == row.id) &&
                                                <div>
                                                    <Dropdown onClick={() => setModalWindow()} />
                                                    <Modal movie={row} handleReload={handleReload} />
                                                </div>}
                                        </td>
                                        <td>{row.director}</td>
                                        <td>{row.actors}</td>
                                        <td>{row.imbd_rating}</td>
                                        <td>{row.user_id.name}{row.recommendation && `: \"${row.recommendation}\"`}</td>
                                        {props.watched &&
                                            <td>
                                                {(row.my_rating == '5') && '⭐⭐⭐⭐⭐'}
                                                {(row.my_rating == '4') && '⭐⭐⭐⭐'}
                                                {(row.my_rating == '3') && '⭐⭐⭐'}
                                                {(row.my_rating == '2') && '⭐⭐'}
                                                {(row.my_rating == '1') && '⭐'}
                                            </td>}
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>


                    {/* Paging */}
                    {pageLoading && <Loader />}
                    {!pageLoading &&
                        <div>
                            <button className={(pageNum <= 0) && "disabled"} disabled={(pageNum <= 0) && "disabled"} onClick={prevPage}>prev</button>
                            <button className={(badRequest || (pageNum >= pageInfo.totalPage - 1)) && "disabled"} disabled={(badRequest || (pageNum >= pageInfo.totalPage - 1)) && "disabled"} onClick={nextPage}>next</button>
                        </div>
                    }

                </div>}
        </div>
    )
}