import { Controller, Get, Query, Param, BadRequestException, UseGuards } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

   private pokemonTypesByWeather: { [key: string]: string[] } = {
    'clear': ['electric', 'fire', 'normal', 'flying', 'psychic'],
    'clouds': ['water', 'flying', 'electric', 'ice'],
    'rain': ['water', 'electric', 'grass', 'bug'],
    'snow': ['ice', 'water', 'flying', 'ground'],
    'thunderstorm': ['electric', 'water', 'flying'],
    'drizzle': ['water', 'electric'],
    'mist': ['water', 'ghost', 'psychic']
  };

   private getWeatherConditionLabel(weather: string): string {
    const labels: { [key: string]: string } = {
      'clear': '☀️ Ensolarado',
      'clouds': '☁️ Nublado',
      'rain': '🌧️ Chuvoso',
      'snow': '❄️ Nevado',
      'thunderstorm': '⚡ Tempestade',
      'drizzle': '🌦️ Garoa',
      'mist': '🌫️ Névoa'
    };
    return labels[weather.toLowerCase()] || '☀️ Ensolarado';
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async list(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '6',
    @Query('weather') weather: string = 'clear'
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || isNaN(limitNum)) {
      throw new BadRequestException('Page e limit devem ser números válidos');
    }

    const result = await this.pokemonService.getPokemons(pageNum, limitNum);
    const weatherLower = weather.toLowerCase();
    const allowedTypes = this.pokemonTypesByWeather[weatherLower] || this.pokemonTypesByWeather['clear'];

    const detailedPokemons = await Promise.all(
      result.results.map(async (pokemon: any) => {
        const details = await this.pokemonService.getPokemonDetails(pokemon.name);
        return {
          id: details.id,
          name: details.name,
          types: details.types.map((t: any) => t.type.name),
          image: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
          stats: details.stats,
          weatherCondition: this.getWeatherConditionLabel(weatherLower)
          
        };
      })
    );

    const filteredPokemons = detailedPokemons.filter(pokemon =>
      pokemon.types.some(type => allowedTypes.includes(type))
    );

    return {
      page: pageNum,
      limit: limitNum,
      total: filteredPokemons.length,
      data: filteredPokemons
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':name')
  async details(@Param('name') name: string) {
    if (!name || name.trim() === '') {
      throw new BadRequestException('Nome do pokémon é obrigatório');
    }
    return this.pokemonService.getPokemonDetails(name.toLowerCase());
  }
}