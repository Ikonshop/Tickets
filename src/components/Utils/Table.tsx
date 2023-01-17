import React, { FC, useState } from 'react'

interface TableProps {
    headers: string[]
    rows: string[][]
    onClick: (row: string[]) => void
}

const Table: FC<TableProps> = ({ headers, rows, onClick }) => {
    const [selectedRow, setSelectedRow] = useState(null)
    const [showDetails, setShowDetails] = useState(false)
    
    const renderRows = () => {
        return rows.map((row, index) => {
            console.log('row is', row)
        return (
            <tr
            key={index}
            onClick={() => {
                setSelectedRow(row)
                setShowDetails(true)
                onClick(row)
            }}
            className="hover:bg-gray-100 cursor-pointer"
            >
            {row.map((item, index) => {
                return <td key={index}>{item}</td>
            })}
            </tr>
        )
        })
    }

    return (
        <div className="flex flex-col">
            <table className="table-auto">
                <thead>
                <tr>
                    {headers.map((header, index) => {
                    return <th key={index}>{header}</th>
                    }
                    )}
                </tr>
                </thead>
                <tbody>
                {renderRows()}
                </tbody>
            </table>
        </div>
    )
}   

export default Table;