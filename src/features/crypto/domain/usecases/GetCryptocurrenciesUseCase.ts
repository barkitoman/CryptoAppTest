import { Cryptocurrency } from '../entities/Cryptocurrency';
import { CryptoRepository } from '../repositories/CryptoRepository';

export class GetCryptocurrenciesUseCase {
    constructor(private repository: CryptoRepository) { }

    async execute(limit: number = 200): Promise<Cryptocurrency[]> {
        return this.repository.getCryptocurrencies(limit);
    }
}
