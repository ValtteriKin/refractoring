// requires npm install uuid
import { v4 as uuidv4 } from 'uuid'



// simulate the database
// let vs const may allow for data to be lost 
const users = [
    {id: uuidv4(), name: 'Alice'},
    {id: uuidv4(), name: 'Bob'}
]
export function getAllUsers(){
    return (users)
}
// === EXACT 
export function getUserById(id){
return users.find( anItem => anItem.id ===id)
}