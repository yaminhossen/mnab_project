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

const tableName = 'account_categories';
const modelName = 'AccountCategoriesModel';

type Infer = InferAttributes<DataModel>;
type InferCreation = InferCreationAttributes<DataModel>;
// type attendance_status = 'present' | 'absent' | 'late' | 'leave';
type status = 'active' | 'deactive';

class DataModel extends Model<Infer, InferCreation> {
    declare id?: CreationOptional<number>;

    declare branch_id?: number;
    declare count_id?: number;
    declare parent_id?: number;
    declare sort_code?: string;
    declare title: string;
    declare description?: string;
    declare balance?: number;
    declare note?: string;
    declare created_by?: string;
    declare system_ip?: string;
    declare system_name?: string;
    declare delete_bit?: string;
    declare account_selection_name?: string;
    declare payments_type_id?: number;
    declare customer_id?: number;
    declare supplier_id?: number;
    declare expense_id?: number;

    declare status?: status;
    declare creator?: number;
    declare created_time?: string;

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
            count_id: {
                type: new DataTypes.BIGINT().UNSIGNED,
                allowNull: true,
            },
            parent_id: {
                type: new DataTypes.BIGINT().UNSIGNED,
                allowNull: true,
            },
            sort_code: {
                type: DataTypes.STRING(25),
                allowNull: true,
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            balance: {
                type: DataTypes.DOUBLE,
                allowNull: true,
            },
            note: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            created_by: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            system_ip: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            system_name: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            delete_bit: {
                type: DataTypes.BIGINT().UNSIGNED,
                allowNull: true,
            },
            account_selection_name: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            payments_type_id: {
                type: DataTypes.BIGINT().UNSIGNED,
                allowNull: true,
            },
            customer_id: {
                type: DataTypes.BIGINT().UNSIGNED,
                allowNull: true,
            },
            supplier_id: {
                type: DataTypes.BIGINT().UNSIGNED,
                allowNull: true,
            },
            expense_id: {
                type: DataTypes.BIGINT().UNSIGNED,
                allowNull: true,
            },

            status: {
                type: new DataTypes.ENUM('active', 'deactive'),
                defaultValue: 'active',
            },
            creator: {
                type: new DataTypes.TINYINT(),
                allowNull: true,
                defaultValue: null,
            },
            created_time: {
                type: new DataTypes.STRING(50),
                allowNull: true,
                defaultValue: null,
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
