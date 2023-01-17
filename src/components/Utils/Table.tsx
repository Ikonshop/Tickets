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
        console.log('rows', rows)
        return (
            <div>
                Table
            </div>

        )
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