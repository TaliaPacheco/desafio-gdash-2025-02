import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'react-toastify';
import { Cloud, Wind, Eye, Droplets, Download, LogOut, Zap } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface WeatherData {
  temp?: number;
  feels_like?: number;
  temp_max?: number;
  temp_min?: number;
  pressure?: number;
  humidity?: number;
  visibility?: number;
  lat?: number;
  log?: number;
  wind?: {
    speed?: number;
    gust?: number;
    deg?: number;
  };
  location?: string;
  description?: string;
}

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  image: string;
  stats?: any;
  weatherCondition?: string;
}



export function Dashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });


  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setError(null);
      setLoading(true);

      let currentWeatherData: WeatherData | null = null;


      try {
        const weatherRes = await fetch('http://localhost:3000/api/weather', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (weatherRes.ok) {
          const weatherArray = await weatherRes.json();
          if (weatherArray.length > 0) {
            currentWeatherData = weatherArray[0];
            setWeatherData(currentWeatherData);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar clima:', err);
      }

      setLoading(false);

      const weatherMap: { [key: string]: string } = {
        'clear': 'clear',
        'sunny': 'clear',
        'clouds': 'clouds',
        'cloudy': 'clouds',
        'rain': 'rain',
        'rainy': 'rain',
        'snow': 'snow',
        'snowy': 'snow',
        'thunderstorm': 'thunderstorm',
        'storm': 'thunderstorm',
        'drizzle': 'drizzle',
        'mist': 'mist',
        'fog': 'mist'
      };

      const weatherDescription = currentWeatherData?.description?.toLowerCase() || 'clear';
      const weatherCondition = Object.entries(weatherMap).find(([key]) => 
        weatherDescription.includes(key)
      )?.[1] || 'clear';

      Promise.all([
        fetch('http://localhost:3000/api/weather/insights', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => data && setInsights(data))
          .catch((err) => console.error('Erro ao carregar insights:', err)),

        fetch(`http://localhost:3000/api/pokemon?limit=6&weather=${weatherCondition}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => data && setPokemons(data.data || []))
          .catch((err) => console.error('Erro ao carregar pokémons:', err)),
      ]);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      toast.error('Erro ao carregar dados');
      setLoading(false);
    }
  }

  async function handleExport(format: 'csv' | 'xlsx') {
    try {
      const endpoint = `http://localhost:3000/api/weather/export/${format}`;
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erro ao exportar');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weather.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Dados exportados em ${format.toUpperCase()}`);
    } catch (err) {
      toast.error(`Erro ao exportar ${format.toUpperCase()}`);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D1117] to-[#161B22] flex items-center justify-center">
        <div className="animate-pulse text-[#58A6FF]">Carregando dashboard...</div>
      </div>
    );
  }

  const getWindLevel = (speed?: number): string => {
  if (!speed) return 'Baixo';
  if (speed >= 30) return 'Alto';
  if (speed >= 15) return 'Médio';
  return 'Baixo';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] to-[#161B22] p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">⛅ Dashboard GDASH</h1>
          <p className="text-[#8B949E]">Monitoramento de clima</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg border border-red-600/30 transition"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-[#161B22] border-[#30363D] hover:border-[#58A6FF]/50 transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[#8B949E] text-sm font-medium">Temperatura</CardTitle>
            <Cloud className="h-4 w-4 text-[#1F6FEB]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {weatherData?.temp ? Math.round(weatherData.temp) : '--'}°C
            </div>
            <p className="text-xs text-[#8B949E] mt-2">
              Máx: {weatherData?.temp_max ? Math.round(weatherData.temp_max) : '--'}° | Min: {weatherData?.temp_min ? Math.round(weatherData.temp_min) : '--'}°
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#161B22] border-[#30363D] hover:border-[#58A6FF]/50 transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[#8B949E] text-sm font-medium">Vento</CardTitle>
            <Wind className="h-4 w-4 text-[#3FB950]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {weatherData?.wind?.speed ? Math.round(weatherData.wind.speed) : '--'} mph
            </div>
            <p className="text-xs text-[#8B949E] mt-2">
              Rajadas: {getWindLevel(weatherData?.wind?.gust)} 
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#161B22] border-[#30363D] hover:border-[#58A6FF]/50 transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[#8B949E] text-sm font-medium">Visibilidade</CardTitle>
            <Eye className="h-4 w-4 text-[#F0883E]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {weatherData?.visibility ? (weatherData.visibility / 1000).toFixed(1) : '--'} km
            </div>
            <p className="text-xs text-[#8B949E] mt-2">Condições: Boas</p>
          </CardContent>
        </Card>

        <Card className="bg-[#161B22] border-[#30363D] hover:border-[#58A6FF]/50 transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[#8B949E] text-sm font-medium">Umidade</CardTitle>
            <Droplets className="h-4 w-4 text-[#79C0FF]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{weatherData?.humidity || '--'}%</div>
            <p className="text-xs text-[#8B949E] mt-2">Pressão: {weatherData?.pressure} mb</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2 bg-[#161B22] border-[#30363D]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              🗺️ MAPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-[#0D1117] to-[#1C2128] rounded-lg p-2 min-h-96 border border-[#30363D] overflow-hidden">
              {weatherData?.temp !== undefined ? (
                <MapContainer
                  center={[-23.958807, -46.331928]}
                  zoom={13}
                  style={{ height: '100%', minHeight: '24rem', borderRadius: '0.5rem' }}
                  dragging={false}
                  touchZoom={false}
                  doubleClickZoom={false}
                  scrollWheelZoom={false}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  {weatherData?.temp !== undefined && (
                    <Marker position={[-23.958807, -46.331928]}>
                      <Popup>
                        <div className="text-center">
                          <p className="font-semibold">{weatherData.location || 'Local'}</p>
                          <p className="text-sm">{weatherData.description}</p>
                          <p className="text-sm">Temp: {Math.round(weatherData.temp)}°C</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <p className="text-[#8B949E]">Carregando mapa...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#F0883E]" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights ? (
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-[#0D1117] rounded border border-[#30363D]">
                  <p className="text-[#8B949E]">📊 Análise IA</p>
                  <p className="text-white  text-xs leading-relaxed">
                    {insights.aiInsight || 'Gerando análise...'}
                  </p>
                </div>

                <div className="p-3 bg-[#0D1117] rounded border border-[#30363D]">
                  <p className="text-[#8B949E]">Temp. Média</p>
                  <p className="text-white font-semibold">
                    {insights.avgTemp ? Math.round(insights.avgTemp) : '--'}°C
                  </p>
                </div>
                <div className="p-3 bg-[#0D1117] rounded border border-[#30363D]">
                  <p className="text-[#8B949E]">Vento Máximo</p>
                  <p className="text-white font-semibold">
                    {insights.maxWindSpeed ? Math.round(insights.maxWindSpeed) : '--'} mph
                  </p>
                </div>
                <div className="p-3 bg-[#0D1117] rounded border border-[#30363D]">
                  <p className="text-[#8B949E]">Registros</p>
                  <p className="text-white font-semibold">{insights.totalRecords || 0}</p>
                </div>
              </div>
            ) : (
              <p className="text-[#8B949E] text-sm">Carregando insights...</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#161B22] border-[#30363D] mb-8">
        <CardHeader>
          <CardTitle className="text-white text-xl">
            🎮 Pokémons que spawnnam nessas condições
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {pokemons.length > 0 ? (
              pokemons.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4 hover:border-[#58A6FF]/50 transition text-center cursor-pointer"
                >
                  {pokemon.image && (
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      className="w-20 h-20 mx-auto mb-2 object-contain"
                    />
                  )}
                  <p className="text-white font-semibold text-sm capitalize">
                    {pokemon.name}
                  </p>
                  {pokemon.weatherCondition && (
                    <p className="text-[#F0883E] text-xs mt-1 font-medium">
                      ☀️ {pokemon.weatherCondition}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {pokemon.types?.slice(0, 2).map((type) => (
                      <span
                        key={type}
                        className="text-xs bg-[#1F6FEB]/20 text-[#58A6FF] px-2 py-1 rounded border border-[#1F6FEB]/30"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-[#8B949E] text-center py-8">
                Carregando pokémons...
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-white">📊 Exportar Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 bg-[#238636] hover:bg-[#2EA043] text-white"
            >
              <Download size={18} />
              Exportar CSV
            </Button>
            <Button
              onClick={() => handleExport('xlsx')}
              className="flex items-center gap-2 bg-[#1F6FEB] hover:bg-[#388BFD] text-white"
            >
              <Download size={18} />
              Exportar XLSX
            </Button>
            <Button
              onClick={fetchDashboardData}
              variant="outline"
              className="flex items-center gap-2 border-[#30363D] text-[#58A6FF] hover:bg-[#0D1117]"
            >
              🔄 Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}