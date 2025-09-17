import { Controller, Get, Post, Body, Patch, Param, Delete, Render } from '@nestjs/common';
import { DrugsService } from './drugs.service';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';

@Controller('drugs')
export class DrugsController {
  constructor(private readonly drugsService: DrugsService) {}
  
  @Post("/search")
  @Render("partials/drugList")
  async search(@Body("search") search: string){
    return this.drugsService.search(search)
  }
  
  @Post()
  create(@Body() createDrugDto: CreateDrugDto) {
    return this.drugsService.create(createDrugDto);
  }

  @Get()
  async findAll() {
    const drugs = await this.drugsService.findAll();
    return {}
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.drugsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDrugDto: UpdateDrugDto) {
    return this.drugsService.update(+id, updateDrugDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.drugsService.remove(+id);
  }
}
