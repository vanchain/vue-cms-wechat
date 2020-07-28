import axios from 'axios'

let delete_avatar = (data) => axios.delete('/api/upload',{params:data});

export default{
	delete_avatar
}