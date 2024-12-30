import { useState, useEffect } from 'react'

export const useAppwrite = (fn) => {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState([])    

  const fetchData = async () => {
    setLoading(true)
    try {
      const posts = await fn()
      if (!posts) throw new Error("Data could not be fetched")
      setData(posts)
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  const refetch = () => fetchData()
  return {data, loading, refetch}
}