import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Auth } from '../Auth/decorators/auth.decorator';
import { ValidRoles } from '../Auth/interfaces/valid-roles';
import { GetUser } from '../Auth/decorators/get-user/get-user.decorator';
import { User } from '../Auth/entities/user.entity';

@Controller('api/v1/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Auth(ValidRoles.user , ValidRoles.admin ) // Solo usuarios autenticados pueden crear comentarios
  create(
    @Body('contentId') contentId: string,
    @Body('userId') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(createCommentDto, userId, contentId);
  }

  @Get() // Ruta abierta para todos los usuarios autenticados
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id') // Ruta abierta para todos los usuarios autenticados
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Post('reply/:id')
  @Auth(ValidRoles.user , ValidRoles.admin) // Solo usuarios autenticados pueden responder a comentarios
  replyToComment(
    @Param('id') parentCommentId: string,
    @Body('userId') userId: string,
    @Body('contentId') contentId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.replyToComment(parentCommentId, createCommentDto, userId, contentId);
  }

  @Get('parent/:id')// Ruta abierta para todos los usuarios autenticados
  findReplies(@Param('id') parentCommentId: string) {
    return this.commentsService.findReplies(parentCommentId);
  }

  @Patch(':id')
  @Auth(ValidRoles.user, ValidRoles.admin) // Usuarios autenticados o admin pueden actualizar
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin) // Solo admin puede eliminar comentarios
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }

  @Get('user')
  @Auth(ValidRoles.user, ValidRoles.admin)
  findByUser(@GetUser() user: User) {
    return this.commentsService.findByUser(user.id);
}

  @Get('content/:id') // Ruta para obtener los comentarios de un contenido específico
  findCommentsByContent(@Param('id') contentId: string) {
    return this.commentsService.findCommentsByContent(contentId);
  }

    // Nuevo método para obtener comentarios por el ID de usuario especificado en la URL
    @Get('user/:userId')
    @Auth(ValidRoles.user, ValidRoles.admin) // Solo usuarios autenticados o admin pueden ver comentarios por usuario
    findByUserId(@Param('userId') userId: string) {
      return this.commentsService.findByUser(userId);
    }

}