import { Injectable } from '@nestjs/common';
import {supabase} from '../db/supabase.client'
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';


export type Drug = {
  name: string,
  regPrice: number,
  bhisPrice: number,
  isAvailable: boolean
}

@Injectable()
export class DrugsService {
  
  async search(search: string){
    try {
    let query = supabase
      .from("drugs")
      .select("id, name, regPrice, bhisPrice, isAvailable")
      .order("name");

    if (search && search.trim() !== "") {
      // ilike = case-insensitive pattern match
      query = query.ilike("name", `%${search}%`);
    }

    const { data: drugs, error } = await query;

    if (error) {
      console.error(error, "Error searching drugs");
    }

    return { drugs, layout: false }
  } catch (err) {
    console.error(err, "Error searching drugs");
  }
  }
  
  
  create(createDrugDto: CreateDrugDto) {
    return 'This action adds a new drug';
  }

  async findAll() {
    try{
    const {data: drugs, error} = await supabase
    .from("drugs")
    .select("*")
    .limit(10)
    
    if (error) throw new Error(error.message)
    
    return drugs
    }catch(error){
      console.log(error)
      return []
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} drug`;
  }

  update(id: number, updateDrugDto: UpdateDrugDto) {
    return `This action updates a #${id} drug`;
  }

  remove(id: number) {
    return `This action removes a #${id} drug`;
  }
}
