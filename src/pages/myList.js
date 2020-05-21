import React, { useEffect, useState } from 'react'
import { Table } from '../components/table/table'

export default function MyList() {
  return (
    <div className="content">
      <h1>Movies I have watched</h1>

      <Table watched dataStructure="movies" endpoint="getMoviesWatched" pageSize={10}/>
    </div>
  )
}