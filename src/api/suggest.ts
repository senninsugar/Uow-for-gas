export async function fetchSuggestions(query: string): Promise<string[]> {
  if (!query.trim()) return []

  try {
    const url = `https://suggestqueries.google.com/complete/search?client=youtube&hl=ja&ds=yt&q=${encodeURIComponent(query)}`
    const response = await fetch(url)
    
    if (!response.ok) return []

    const arrayBuffer = await response.arrayBuffer()
    const decoder = new TextDecoder('shift_jis')
    const text = decoder.decode(arrayBuffer)
    
    const match = text.match(/^window\.google\.ac\.hr\((.*)\)$/)
    if (match && match[1]) {
      const data = JSON.parse(match[1])
      if (data && data[1]) {
        return data[1].map((item: any[]) => item[0])
      }
    }

    const jsonData = JSON.parse(text)
    if (jsonData && jsonData[1]) {
      return jsonData[1]
    }

    return []
  } catch (error) {
    console.error(error)
    return []
  }
}
