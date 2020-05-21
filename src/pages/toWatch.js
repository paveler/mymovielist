import React, { useEffect, useState } from 'react'
import { Table } from '../components/table/table'

export default function ToWatch() {
  return (
    <div className="content">
      <h1>Movies to watch</h1>

      <Table dataStructure="movies" endpoint="getMoviesToWatch" pageSize={10}/>
    </div>
  )
}