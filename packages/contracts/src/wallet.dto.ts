import { IsNumber, IsUUID } from "class-validator";

export class CreateWalletDto {
  @IsUUID()
  userId!: string;
}

export class GetWalletDto {
  @IsUUID()
  userId!: string;
}

export class UpdateWalletBalanceDto {
  @IsUUID()
  userId!: string;

  @IsNumber()
  amount!: number;
}
