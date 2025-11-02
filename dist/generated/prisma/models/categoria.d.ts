import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type categoriaModel = runtime.Types.Result.DefaultSelection<Prisma.$categoriaPayload>;
export type AggregateCategoria = {
    _count: CategoriaCountAggregateOutputType | null;
    _avg: CategoriaAvgAggregateOutputType | null;
    _sum: CategoriaSumAggregateOutputType | null;
    _min: CategoriaMinAggregateOutputType | null;
    _max: CategoriaMaxAggregateOutputType | null;
};
export type CategoriaAvgAggregateOutputType = {
    id: number | null;
};
export type CategoriaSumAggregateOutputType = {
    id: number | null;
};
export type CategoriaMinAggregateOutputType = {
    id: number | null;
    nombreCat: string | null;
    descpCat: string | null;
};
export type CategoriaMaxAggregateOutputType = {
    id: number | null;
    nombreCat: string | null;
    descpCat: string | null;
};
export type CategoriaCountAggregateOutputType = {
    id: number;
    nombreCat: number;
    descpCat: number;
    _all: number;
};
export type CategoriaAvgAggregateInputType = {
    id?: true;
};
export type CategoriaSumAggregateInputType = {
    id?: true;
};
export type CategoriaMinAggregateInputType = {
    id?: true;
    nombreCat?: true;
    descpCat?: true;
};
export type CategoriaMaxAggregateInputType = {
    id?: true;
    nombreCat?: true;
    descpCat?: true;
};
export type CategoriaCountAggregateInputType = {
    id?: true;
    nombreCat?: true;
    descpCat?: true;
    _all?: true;
};
export type CategoriaAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.categoriaWhereInput;
    orderBy?: Prisma.categoriaOrderByWithRelationInput | Prisma.categoriaOrderByWithRelationInput[];
    cursor?: Prisma.categoriaWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CategoriaCountAggregateInputType;
    _avg?: CategoriaAvgAggregateInputType;
    _sum?: CategoriaSumAggregateInputType;
    _min?: CategoriaMinAggregateInputType;
    _max?: CategoriaMaxAggregateInputType;
};
export type GetCategoriaAggregateType<T extends CategoriaAggregateArgs> = {
    [P in keyof T & keyof AggregateCategoria]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCategoria[P]> : Prisma.GetScalarType<T[P], AggregateCategoria[P]>;
};
export type categoriaGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.categoriaWhereInput;
    orderBy?: Prisma.categoriaOrderByWithAggregationInput | Prisma.categoriaOrderByWithAggregationInput[];
    by: Prisma.CategoriaScalarFieldEnum[] | Prisma.CategoriaScalarFieldEnum;
    having?: Prisma.categoriaScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CategoriaCountAggregateInputType | true;
    _avg?: CategoriaAvgAggregateInputType;
    _sum?: CategoriaSumAggregateInputType;
    _min?: CategoriaMinAggregateInputType;
    _max?: CategoriaMaxAggregateInputType;
};
export type CategoriaGroupByOutputType = {
    id: number;
    nombreCat: string;
    descpCat: string;
    _count: CategoriaCountAggregateOutputType | null;
    _avg: CategoriaAvgAggregateOutputType | null;
    _sum: CategoriaSumAggregateOutputType | null;
    _min: CategoriaMinAggregateOutputType | null;
    _max: CategoriaMaxAggregateOutputType | null;
};
type GetCategoriaGroupByPayload<T extends categoriaGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CategoriaGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CategoriaGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CategoriaGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CategoriaGroupByOutputType[P]>;
}>>;
export type categoriaWhereInput = {
    AND?: Prisma.categoriaWhereInput | Prisma.categoriaWhereInput[];
    OR?: Prisma.categoriaWhereInput[];
    NOT?: Prisma.categoriaWhereInput | Prisma.categoriaWhereInput[];
    id?: Prisma.IntFilter<"categoria"> | number;
    nombreCat?: Prisma.StringFilter<"categoria"> | string;
    descpCat?: Prisma.StringFilter<"categoria"> | string;
};
export type categoriaOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    nombreCat?: Prisma.SortOrder;
    descpCat?: Prisma.SortOrder;
};
export type categoriaWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.categoriaWhereInput | Prisma.categoriaWhereInput[];
    OR?: Prisma.categoriaWhereInput[];
    NOT?: Prisma.categoriaWhereInput | Prisma.categoriaWhereInput[];
    nombreCat?: Prisma.StringFilter<"categoria"> | string;
    descpCat?: Prisma.StringFilter<"categoria"> | string;
}, "id">;
export type categoriaOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    nombreCat?: Prisma.SortOrder;
    descpCat?: Prisma.SortOrder;
    _count?: Prisma.categoriaCountOrderByAggregateInput;
    _avg?: Prisma.categoriaAvgOrderByAggregateInput;
    _max?: Prisma.categoriaMaxOrderByAggregateInput;
    _min?: Prisma.categoriaMinOrderByAggregateInput;
    _sum?: Prisma.categoriaSumOrderByAggregateInput;
};
export type categoriaScalarWhereWithAggregatesInput = {
    AND?: Prisma.categoriaScalarWhereWithAggregatesInput | Prisma.categoriaScalarWhereWithAggregatesInput[];
    OR?: Prisma.categoriaScalarWhereWithAggregatesInput[];
    NOT?: Prisma.categoriaScalarWhereWithAggregatesInput | Prisma.categoriaScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"categoria"> | number;
    nombreCat?: Prisma.StringWithAggregatesFilter<"categoria"> | string;
    descpCat?: Prisma.StringWithAggregatesFilter<"categoria"> | string;
};
export type categoriaCreateInput = {
    nombreCat: string;
    descpCat: string;
};
export type categoriaUncheckedCreateInput = {
    id?: number;
    nombreCat: string;
    descpCat: string;
};
export type categoriaUpdateInput = {
    nombreCat?: Prisma.StringFieldUpdateOperationsInput | string;
    descpCat?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type categoriaUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    nombreCat?: Prisma.StringFieldUpdateOperationsInput | string;
    descpCat?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type categoriaCreateManyInput = {
    id?: number;
    nombreCat: string;
    descpCat: string;
};
export type categoriaUpdateManyMutationInput = {
    nombreCat?: Prisma.StringFieldUpdateOperationsInput | string;
    descpCat?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type categoriaUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    nombreCat?: Prisma.StringFieldUpdateOperationsInput | string;
    descpCat?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type categoriaCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nombreCat?: Prisma.SortOrder;
    descpCat?: Prisma.SortOrder;
};
export type categoriaAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type categoriaMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nombreCat?: Prisma.SortOrder;
    descpCat?: Prisma.SortOrder;
};
export type categoriaMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    nombreCat?: Prisma.SortOrder;
    descpCat?: Prisma.SortOrder;
};
export type categoriaSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type categoriaSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nombreCat?: boolean;
    descpCat?: boolean;
}, ExtArgs["result"]["categoria"]>;
export type categoriaSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nombreCat?: boolean;
    descpCat?: boolean;
}, ExtArgs["result"]["categoria"]>;
export type categoriaSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    nombreCat?: boolean;
    descpCat?: boolean;
}, ExtArgs["result"]["categoria"]>;
export type categoriaSelectScalar = {
    id?: boolean;
    nombreCat?: boolean;
    descpCat?: boolean;
};
export type categoriaOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "nombreCat" | "descpCat", ExtArgs["result"]["categoria"]>;
export type $categoriaPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "categoria";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        nombreCat: string;
        descpCat: string;
    }, ExtArgs["result"]["categoria"]>;
    composites: {};
};
export type categoriaGetPayload<S extends boolean | null | undefined | categoriaDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$categoriaPayload, S>;
export type categoriaCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<categoriaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CategoriaCountAggregateInputType | true;
};
export interface categoriaDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['categoria'];
        meta: {
            name: 'categoria';
        };
    };
    findUnique<T extends categoriaFindUniqueArgs>(args: Prisma.SelectSubset<T, categoriaFindUniqueArgs<ExtArgs>>): Prisma.Prisma__categoriaClient<runtime.Types.Result.GetResult<Prisma.$categoriaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends categoriaFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, categoriaFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__categoriaClient<runtime.Types.Result.GetResult<Prisma.$categoriaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends categoriaFindFirstArgs>(args?: Prisma.SelectSubset<T, categoriaFindFirstArgs<ExtArgs>>): Prisma.Prisma__categoriaClient<runtime.Types.Result.GetResult<Prisma.$categoriaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends categoriaFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, categoriaFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__categoriaClient<runtime.Types.Result.GetResult<Prisma.$categoriaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends categoriaFindManyArgs>(args?: Prisma.SelectSubset<T, categoriaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$categoriaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends categoriaCreateArgs>(args: Prisma.SelectSubset<T, categoriaCreateArgs<ExtArgs>>): Prisma.Prisma__categoriaClient<runtime.Types.Result.GetResult<Prisma.$categoriaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends categoriaCreateManyArgs>(args?: Prisma.SelectSubset<T, categoriaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends categoriaCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, categoriaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$categoriaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends categoriaDeleteArgs>(args: Prisma.SelectSubset<T, categoriaDeleteArgs<ExtArgs>>): Prisma.Prisma__categoriaClient<runtime.Types.Result.GetResult<Prisma.$categoriaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends categoriaUpdateArgs>(args: Prisma.SelectSubset<T, categoriaUpdateArgs<ExtArgs>>): Prisma.Prisma__categoriaClient<runtime.Types.Result.GetResult<Prisma.$categoriaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends categoriaDeleteManyArgs>(args?: Prisma.SelectSubset<T, categoriaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends categoriaUpdateManyArgs>(args: Prisma.SelectSubset<T, categoriaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends categoriaUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, categoriaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$categoriaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends categoriaUpsertArgs>(args: Prisma.SelectSubset<T, categoriaUpsertArgs<ExtArgs>>): Prisma.Prisma__categoriaClient<runtime.Types.Result.GetResult<Prisma.$categoriaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends categoriaCountArgs>(args?: Prisma.Subset<T, categoriaCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CategoriaCountAggregateOutputType> : number>;
    aggregate<T extends CategoriaAggregateArgs>(args: Prisma.Subset<T, CategoriaAggregateArgs>): Prisma.PrismaPromise<GetCategoriaAggregateType<T>>;
    groupBy<T extends categoriaGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: categoriaGroupByArgs['orderBy'];
    } : {
        orderBy?: categoriaGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, categoriaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoriaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: categoriaFieldRefs;
}
export interface Prisma__categoriaClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface categoriaFieldRefs {
    readonly id: Prisma.FieldRef<"categoria", 'Int'>;
    readonly nombreCat: Prisma.FieldRef<"categoria", 'String'>;
    readonly descpCat: Prisma.FieldRef<"categoria", 'String'>;
}
export type categoriaFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.categoriaSelect<ExtArgs> | null;
    omit?: Prisma.categoriaOmit<ExtArgs> | null;
    where: Prisma.categoriaWhereUniqueInput;
};
export type categoriaFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.categoriaSelect<ExtArgs> | null;
    omit?: Prisma.categoriaOmit<ExtArgs> | null;
    where: Prisma.categoriaWhereUniqueInput;
};
export type categoriaFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.categoriaSelect<ExtArgs> | null;
    omit?: Prisma.categoriaOmit<ExtArgs> | null;
    where?: Prisma.categoriaWhereInput;
    orderBy?: Prisma.categoriaOrderByWithRelationInput | Prisma.categoriaOrderByWithRelationInput[];
    cursor?: Prisma.categoriaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CategoriaScalarFieldEnum | Prisma.CategoriaScalarFieldEnum[];
};
export type categoriaFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.categoriaSelect<ExtArgs> | null;
    omit?: Prisma.categoriaOmit<ExtArgs> | null;
    where?: Prisma.categoriaWhereInput;
    orderBy?: Prisma.categoriaOrderByWithRelationInput | Prisma.categoriaOrderByWithRelationInput[];
    cursor?: Prisma.categoriaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CategoriaScalarFieldEnum | Prisma.CategoriaScalarFieldEnum[];
};
export type categoriaFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.categoriaSelect<ExtArgs> | null;
    omit?: Prisma.categoriaOmit<ExtArgs> | null;
    where?: Prisma.categoriaWhereInput;
    orderBy?: Prisma.categoriaOrderByWithRelationInput | Prisma.categoriaOrderByWithRelationInput[];
    cursor?: Prisma.categoriaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CategoriaScalarFieldEnum | Prisma.CategoriaScalarFieldEnum[];
};
export type categoriaCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.categoriaSelect<ExtArgs> | null;
    omit?: Prisma.categoriaOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.categoriaCreateInput, Prisma.categoriaUncheckedCreateInput>;
};
export type categoriaCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.categoriaCreateManyInput | Prisma.categoriaCreateManyInput[];
    skipDuplicates?: boolean;
};
export type categoriaCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.categoriaSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.categoriaOmit<ExtArgs> | null;
    data: Prisma.categoriaCreateManyInput | Prisma.categoriaCreateManyInput[];
    skipDuplicates?: boolean;
};
export type categoriaUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.categoriaSelect<ExtArgs> | null;
    omit?: Prisma.categoriaOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.categoriaUpdateInput, Prisma.categoriaUncheckedUpdateInput>;
    where: Prisma.categoriaWhereUniqueInput;
};
export type categoriaUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.categoriaUpdateManyMutationInput, Prisma.categoriaUncheckedUpdateManyInput>;
    where?: Prisma.categoriaWhereInput;
    limit?: number;
};
export type categoriaUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.categoriaSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.categoriaOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.categoriaUpdateManyMutationInput, Prisma.categoriaUncheckedUpdateManyInput>;
    where?: Prisma.categoriaWhereInput;
    limit?: number;
};
export type categoriaUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.categoriaSelect<ExtArgs> | null;
    omit?: Prisma.categoriaOmit<ExtArgs> | null;
    where: Prisma.categoriaWhereUniqueInput;
    create: Prisma.XOR<Prisma.categoriaCreateInput, Prisma.categoriaUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.categoriaUpdateInput, Prisma.categoriaUncheckedUpdateInput>;
};
export type categoriaDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.categoriaSelect<ExtArgs> | null;
    omit?: Prisma.categoriaOmit<ExtArgs> | null;
    where: Prisma.categoriaWhereUniqueInput;
};
export type categoriaDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.categoriaWhereInput;
    limit?: number;
};
export type categoriaDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.categoriaSelect<ExtArgs> | null;
    omit?: Prisma.categoriaOmit<ExtArgs> | null;
};
export {};
