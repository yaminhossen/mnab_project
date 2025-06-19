import {
    // Association,
    DataTypes,
    // HasManyAddAssociationMixin,
    // HasManyCountAssociationsMixin,
    // HasManyCreateAssociationMixin,
    // HasManyGetAssociationsMixin,
    // HasManyHasAssociationMixin,
    // HasManySetAssociationsMixin,
    // HasManyAddAssociationsMixin,
    // HasManyHasAssociationsMixin,
    // HasManyRemoveAssociationMixin,
    // HasManyRemoveAssociationsMixin,
    Model,
    // ModelDefined,
    // Optional,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DefaultSetOptions,
    // NonAttribute,
    // ForeignKey,
} from 'sequelize';

const tableName = 'meeting_agendas';
const modelName = 'MeetingAgendasModel';

type Infer = InferAttributes<DataModel>;
type InferCreation = InferCreationAttributes<DataModel>;
enum is_complete {
    pending = 'pending',
    running = 'running',
    completed = 'completed',
    nexttime = 'nexttime',
}
type status = 'active' | 'deactive';
type meeting_type = 'online' | 'offline';

class DataModel extends Model<Infer, InferCreation> {
    declare id?: CreationOptional<number>;

    declare branch_id?: number;
    declare meeting_id: number;
    declare title: string;
    declare description: string;
    declare role: string;
    declare is_complete?: is_complete;
    declare time?: string;
    declare date?: string;
    declare meeting_link?: string;
    declare meeting_type?: meeting_type;

    declare status?: status;
    declare creator?: number;
    declare created_at?: CreationOptional<Date>;
    declare updated_at?: CreationOptional<Date>;
}

function init(sequelize: Sequelize) {
    DataModel.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            branch_id: {
                type: new DataTypes.BIGINT().UNSIGNED,
                allowNull: true,
            },
            meeting_id: {
                type: new DataTypes.BIGINT().UNSIGNED,
                allowNull: true,
            },
            title: {
                type: new DataTypes.STRING(128),
                allowNull: true,
            },
            description: {
                type: new DataTypes.TEXT(),
                allowNull: true,
            },
            role: {
                type: new DataTypes.STRING(50),
                allowNull: true,
            },
            time: {
                type: new DataTypes.TIME(),
                allowNull: true,
            },
            date: {
                type: new DataTypes.DATE(),
                allowNull: true,
            },
            meeting_link: {
                type: new DataTypes.STRING(150),
                allowNull: true,
            },
            is_complete: {
                type: new DataTypes.ENUM(
                    'pending',
                    'running',
                    'completed',
                    'nexttime',
                ),
                allowNull: true,
            },
            meeting_type: {
                type: new DataTypes.ENUM('online', 'offline'),
                defaultValue: 'offline',
            },
            creator: {
                type: new DataTypes.TINYINT(),
                allowNull: true,
                defaultValue: null,
            },
            status: {
                type: new DataTypes.ENUM('active', 'deactive'),
                defaultValue: 'active',
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: tableName,
            modelName: modelName,
            sequelize, // passing the `sequelize` instance is required
            underscored: true,
        },
    );

    return DataModel;
}

export { init, DataModel };
