import React, { FC, useState } from 'react'
import TicketDetails from "../../components/TicketDetails/TicketDetails"
import Button from "../../components/Utils/Button"


interface TableProps {
    headers: string[]
    rows: string[][]
    onClick: (row: string[]) => void
}

const renderTicketDetails = (nft) => {
    console.log('address', nft.address)
    console.log('nft', ...nft.json.attributes)
    const {name, description, image, symbol, attributes} = nft.json
    console.log('attributes', attributes)
    //VESPADT
    const venue = attributes[0].value
    const event = attributes[1].value
    const seat = attributes[2].value
    const price =  attributes[3].value
    const accessories = attributes[4].value
    const date = attributes[5].value
    const time = attributes[6].value

    return(
      <>
        <Button title="close" onClick={() => console.log('click')} />
        <TicketDetails 
          perks={perksInPocket}
          address={nft.address} 
          name={name}
          description={description}
          image={image}
          symbol={symbol}
          venue={venue}
          event={event}
          seat={seat}
          price={price}
          accessories={accessories}
          date={date}
          time={time}
        />
      </>
    )
  }

const Table: React.FC<TableProps> = ({headers, rows, onClick}) => {
    return (
        <table className={"table-auto text-left w-full text-black"}>
            <thead>
                <tr className={"bg-gray-200 text-black"}>
                    {headers.map((header, index) => (
                        <th key={index}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => (
                    <tr key={index}>
                        {Object.entries(row).map(([key, value], index) => (
                            <td className={"border px-4 py-2 text-black"} key={index}>
                                {
                                    value.length > 8 ? (
                                        value.slice(0,4) + "..." + value.slice(value.length - 4)
                                    ) : (
                                        value
                                    )
                                }
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};



export default Table;