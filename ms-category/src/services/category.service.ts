import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryExpenseEntity } from '../common/entities/category-expense.entity';
import { EntityNotFoundError, Repository } from "typeorm";
import { CreateCategoryDto } from "../dto/caterogy-expense.dto";
import { UtilLib } from "src/common/libs/util.lib";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryExpenseEntity)
        private readonly categoryRepository: Repository<CategoryExpenseEntity>,
        private readonly utilLib: UtilLib
    ) {
    }

    async createOrUpdate(categoryData: CreateCategoryDto, userId: number): Promise<CategoryExpenseEntity> {
        try {
            if (!userId) throw new BadRequestException('User ID is required');
            const existingForUser = await this.categoryRepository.findOne({
                where: {
                    name: categoryData.name,
                    creator: { id: userId }
                }
            });

            if (existingForUser && !categoryData.id) {
                throw new ConflictException('Category already exists for this user');
            }

            let category: CategoryExpenseEntity;
            const existingCategory = categoryData.id
                ? await this.categoryRepository.findOne({
                    where: { id: categoryData.id },
                    relations: ['creator']
                })
                : null;

            if (existingCategory) {
                if (existingCategory.creator?.id !== userId) {
                    throw new ConflictException('Cannot modify other users categories');
                }

                Object.assign(existingCategory, {
                    ...categoryData,
                    updatedAt: new Date()
                });

                category = await this.categoryRepository.save(existingCategory);
            } else {
                category = await this.categoryRepository.save({
                    ...categoryData,
                    creator: { id: userId },
                    status: categoryData.status ?? 1
                });
            }

            return category;
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new BadRequestException('Category not found');
            }
            if (error instanceof ConflictException || error instanceof BadRequestException) {
                throw error;
            }
            console.error(error);
            throw new Error('Operation failed');
        }
    }

    async getAll({ whereModel }, userId: number) {
        try {
            if (!userId) {
                throw new BadRequestException('User ID is required');
            }

            const where = {
                ...this.utilLib.whereBuilder({
                    whereModel,
                    codes: ['name', 'type']
                }),
                status: 1,
                creator: { id: userId }
            };

            return await this.categoryRepository.find({
                where,
                relations: ['creator']
            });

        } catch(error) {
            throw new Error(`Get categories error: ${error.message}`);
        }
    }

    async findAll({ whereModel, take, skip }, userId: number) {
        try {
            if (!userId) {
                throw new BadRequestException('User ID is required');
            }

            const where = {
                ...this.utilLib.whereBuilder({
                    whereModel,
                    codes: ['name', 'type'],
                }),
                status: 1,
                creator: { id: userId }
            };

            const result = await this.categoryRepository.findAndCount({
                where,
                relations: ['creator'],
                take,
                skip,
                order: { createdAt: 'DESC' }
            });

            return this.utilLib.resultTransformer(result);
        } catch (error) {
            throw new Error(`Find categories error: ${error.message}`);
        }
    }


    async findOne({ whereModel }, userId: number) {
        try {
            if (!userId) {
                throw new BadRequestException('User ID is required');
            }

            const where = {
                ...this.utilLib.whereBuilder({
                    whereModel,
                    codes: ['code']
                }),
                status: 1,
                creator: { id: userId }
            };

            return await this.categoryRepository.findOne({
                where,
                relations: ['creator']
            });
        } catch (error) {
            throw new Error(`Find category error: ${error.message}`);
        }
    }

    async findById(id: number, userId: number) {
        try {
            if (!userId) {
                throw new BadRequestException('User ID is required');
            }

            return await this.categoryRepository.findOne({
                where: {
                    id,
                    status: 1,
                    creator: { id: userId }
                },
                relations: ['creator']
            });
        } catch (error) {
            throw new Error(`Find category error: ${error.message}`);
        }
    }



    async inactivate(id: number, userId: number): Promise<void> {
        try {
            const category = await this.categoryRepository.findOne({
                where: { id },
                relations: ['creator'],
                select: ['id', 'status', 'creator']
            });

            if (!category) {
                throw new EntityNotFoundError(CategoryExpenseEntity, id);
            }

            if (category.creator?.id !== userId) {
                throw new ForbiddenException('No tienes permiso para desactivar esta categoría');
            }

            await this.categoryRepository.save({
                ...category,
                status: 0,
                updatedAt: new Date()
            });

        } catch (error) {
            console.error(`Error al desactivar categoría ${id}:`, error);
            throw new InternalServerErrorException('Error en la desactivación');
        }
    }



}
