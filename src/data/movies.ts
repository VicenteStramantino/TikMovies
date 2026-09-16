export type Movie = {
  id: number
  title: string
  year: number
  rating: number
  genres: string[]
  decade: string
  description: string
  poster: string
  backdrop: string
  streaming: string[]
}

export const genres = ['Todos', 'Drama', 'Ação', 'Ficção científica', 'Animação']

export const movies: Movie[] = [
  {
    id: 1,
    title: 'Interestelar',
    year: 2014,
    rating: 8.7,
    genres: ['Ficção científica', 'Drama'],
    decade: '2010s',
    description: 'Uma equipe de exploradores viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.',
    poster: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600&q=80',
    streaming: ['Netflix', 'Prime Video'],
  },
  {
    id: 2,
    title: 'O Poderoso Chefão',
    year: 1972,
    rating: 9.2,
    genres: ['Drama'],
    decade: '1970s',
    description: 'O patriarca de uma família do crime transfere o controle de seu império para o filho mais jovem.',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&q=80',
    streaming: ['MGM+', 'Prime Video'],
  },
  {
    id: 3,
    title: 'Parasita',
    year: 2019,
    rating: 8.5,
    genres: ['Drama'],
    decade: '2010s',
    description: 'Duas famílias de realidades opostas se aproximam em uma história cheia de reviravoltas.',
    poster: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80',
    streaming: ['Netflix'],
  },
  {
    id: 4,
    title: 'A Viagem de Chihiro',
    year: 2001,
    rating: 8.6,
    genres: ['Animação'],
    decade: '2000s',
    description: 'Uma garota entra em um mundo mágico e precisa encontrar coragem para salvar seus pais.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80',
    streaming: ['Max', 'Netflix'],
  },
  {
    id: 5,
    title: 'Matrix',
    year: 1999,
    rating: 8.7,
    genres: ['Ação', 'Ficção científica'],
    decade: '1990s',
    description: 'Um programador descobre que a realidade como conhecemos é uma grande simulação.',
    poster: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1600&q=80',
    streaming: ['Prime Video', 'Apple TV'],
  },
  {
    id: 6,
    title: 'Mad Max: Estrada da Fúria',
    year: 2015,
    rating: 8.1,
    genres: ['Ação'],
    decade: '2010s',
    description: 'Em um futuro destruído, uma fuga pelo deserto se transforma em uma luta pela liberdade.',
    poster: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1600&q=80',
    streaming: ['Max', 'Prime Video'],
  },
]
