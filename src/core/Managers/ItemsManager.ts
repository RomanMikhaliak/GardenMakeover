export class ItemManager {
  private static instance: ItemManager;

  private items: { [group: string]: string[] } = {
    chicken: ['chicken_1'],
    corn: ['corn_1', 'corn_2', 'corn_3'],
    cow: ['cow_1'],
    grape: ['grape_1', 'grape_2', 'grape_3'],
    sheep: ['sheep_1'],
    strawberry: ['strawberry_1', 'strawberry_2', 'strawberry_3'],
    tomato: ['tomato_1', 'tomato_2', 'tomato_3'],
  };

  public selectionBuffer: string[] = [];
  public selectedItem: string | null = null;

  private constructor() {}

  public static getInstance(): ItemManager {
    if (!ItemManager.instance) {
      ItemManager.instance = new ItemManager();
    }
    return ItemManager.instance;
  }

  public getGroups(): string[] {
    return Object.keys(this.items);
  }

  public getItemsByGroup(group: string): string[] {
    return this.items[group] || [];
  }

  public addItem(id: string): void {
    this.selectionBuffer.push(id);
    this.selectedItem = id;
    console.log(`Item added: ${id}`);
  }
}
