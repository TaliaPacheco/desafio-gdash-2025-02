import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';


@Injectable()
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  async getPokemons(page: number = 1, limit: number = 20) {
    try {
      if (page < 1 || limit < 1) {
        throw new HttpException('Page e limit devem ser maiores que 0', HttpStatus.BAD_REQUEST);
      }

      if (limit > 100) {
        limit = 100;
      }

      const offset = (page - 1) * limit;

      const { data } = await axios.get(`${this.baseUrl}?offset=${offset}&limit=${limit}`);

      return {
        page,
        limit,
        total: data.count,
        results: data.results
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao buscar pokémons', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPokemonDetails(name: string) {
    try {
      if (!name || name.trim() === '') {
        throw new HttpException('Nome do pokémon é obrigatório', HttpStatus.BAD_REQUEST);
      }

      const { data } = await axios.get(`${this.baseUrl}/${name}`);
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.response?.status === 404) {
        throw new HttpException('Pokémon não encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Erro ao buscar detalhes do pokémon', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
