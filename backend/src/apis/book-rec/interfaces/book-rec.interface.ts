export interface IBookRecommendation {
    id?: number;
    userId: number;
    bookId: number;
    isFavorite?: boolean;
  }
  
  export interface IBookRecommendationService {
    findAll(userId: number, args?: any): Promise<IBookRecommendation[]>;
    findOne(id: number, userId: number): Promise<IBookRecommendation>;
    create(bookRecommendation: IBookRecommendation): Promise<IBookRecommendation>;
    update(id: number, bookRecommendation: Partial<IBookRecommendation>, userId: number): Promise<IBookRecommendation>;
    delete(id: number, userId: number): Promise<boolean>;
    toggleFavorite(id: number, userId: number): Promise<IBookRecommendation>;
    getRecommendations(userId: number, subject: string): Promise<any[]>;
  }
  