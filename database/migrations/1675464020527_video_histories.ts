import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'video_histories'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigInteger('user_id').references('users.id').onDelete('CASCADE')
      table.bigInteger('video_id').references('videos.id').onDelete('CASCADE')
      table.primary(['user_id','video_id'])
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
