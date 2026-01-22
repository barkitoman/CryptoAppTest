import { Cryptocurrency } from '../entities/Cryptocurrency';
import { CryptoRepository } from '../repositories/CryptoRepository';

export class GetCryptocurrenciesUseCase {
    constructor(private repository: CryptoRepository) { }

    async execute(start: number = 1, limit: number = 50): Promise<Cryptocurrency[]> {
        return this.repository.getCryptocurrencies(start, limit);
    }
}
