package com.casesoft.dmc.service.cfg;

import com.casesoft.dmc.core.dao.PropertyFilter;
import com.casesoft.dmc.core.service.AbstractBaseService;
import com.casesoft.dmc.core.util.CommonUtil;
import com.casesoft.dmc.core.util.page.Page;
import com.casesoft.dmc.dao.cfg.MultiLevelRelationDao;
import com.casesoft.dmc.model.cfg.MultiLevelRelation;
import com.casesoft.dmc.model.cfg.PropertyKey;
import com.casesoft.dmc.model.cfg.VO.State;
import com.casesoft.dmc.model.cfg.VO.TreeVO;
import com.casesoft.dmc.model.sys.Unit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yushen on 2018/5/17.
 */
@Service
@Transactional
public class MultiLevelRelationService extends AbstractBaseService<MultiLevelRelation, String> {

    @Autowired
    private MultiLevelRelationDao multiLevelRelationDao;

    @Override
    public Page<MultiLevelRelation> findPage(Page<MultiLevelRelation> page, List<PropertyFilter> filters) {
        return null;
    }

    @Override
    public void save(MultiLevelRelation entity) {
        this.multiLevelRelationDao.save(entity);
    }

    //组织架构的多级关系保存
    public void save(Unit company, String multiLevelType) {
        this.save(company.getId(), company.getCode(), company.getName(), company.getOwnerId(), multiLevelType);
    }

    //商品分类多级关系保存
    public void save(PropertyKey entity, String parentId, String multiLevelType) {
        this.save(entity.getId(), entity.getCode(), entity.getName(), parentId, multiLevelType);
    }

    public void save(String id, String code, String name, String parentId, String multiLevelType) {
        try {
            MultiLevelRelation multiLevelRelation = this.get("relatedId", id);
            if (CommonUtil.isBlank(multiLevelRelation)) {
                multiLevelRelation = new MultiLevelRelation();
                multiLevelRelation.setId(id);
                multiLevelRelation.setCode(code);
                multiLevelRelation.setRelatedId(id);
                multiLevelRelation.setMultiLevelType(multiLevelType);
                multiLevelRelation.setRoot(false);
                multiLevelRelation.setArchive(false);
                multiLevelRelation.setOpenedState(true);
                Integer maxSeqNo = this.getMaxSeqNo(parentId);
                multiLevelRelation.setTreeSeqNo(maxSeqNo);
            }
            multiLevelRelation.setName(name);
            MultiLevelRelation parent;
            if(multiLevelRelation.getRoot()){
                parent = null;
            }else {
                parent = this.get("id", parentId);
            }
            if (CommonUtil.isBlank(parent)) {
                multiLevelRelation.setParentId(null);
                multiLevelRelation.setTreePath(id + ">");
                multiLevelRelation.setDepth(0);
                this.multiLevelRelationDao.saveOrUpdate(multiLevelRelation);
            }else {
                multiLevelRelation.setParentId(parentId);
                multiLevelRelation.setTreePath(parent.getTreePath() + id + ">");
                multiLevelRelation.setDepth(parent.getDepth() + 1);
                this.multiLevelRelationDao.saveOrUpdate(multiLevelRelation);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public MultiLevelRelation load(String id) {
        return this.get("id", id);
    }

    @Override
    public MultiLevelRelation get(String propertyName, Object value) {

        return this.multiLevelRelationDao.findUniqueBy(propertyName, value);
    }

    @Override
    public List<MultiLevelRelation> find(List<PropertyFilter> filters) {
        return null;
    }

    @Override
    public List<MultiLevelRelation> getAll() {
        return null;
    }

    @Override
    public <X> List<X> findAll() {
        return null;
    }

    @Override
    public void update(MultiLevelRelation entity) {

    }

    @Override
    public void delete(MultiLevelRelation entity) {

    }

    @Override
    public void delete(String id) {

    }

    private Integer getMaxSeqNo(String parentId) {
        Integer code = this.multiLevelRelationDao.findUnique("select max(treeSeqNo) from MultiLevelRelation where parentId = ?", parentId);
        if (code == null) {
            code = 0;
        } else {
            code = code + 1;
        }
        return code;
    }

    public List<MultiLevelRelation> listByType(String multiLevelType) {
        return this.multiLevelRelationDao.find("from MultiLevelRelation where multiLevelType = ? order by treeSeqNo", multiLevelType);
    }

    public List<TreeVO> listTree(String multiLevelType) {
        List<MultiLevelRelation> relationList = this.listByType(multiLevelType);
        return treeRelationList(relationList, null);
    }

    private List<TreeVO> treeRelationList(List<MultiLevelRelation> relationList, String parentId) {
        List<TreeVO> result = new ArrayList<>();
        for (MultiLevelRelation relation : relationList) {
            String pid = relation.getParentId();
            if ((parentId == null && pid == null) || (parentId != null && parentId.equals(pid))) {
                TreeVO treeVO = new TreeVO();
                treeVO.setId(relation.getId());
                treeVO.setText(relation.getName());
                if (relation.getOpenedState()) {
                    treeVO.setState(new State(true));
                }
                List<TreeVO> childrenTreeVO = treeRelationList(relationList, relation.getId());
                treeVO.setChildren(childrenTreeVO);
                result.add(treeVO);
            }
        }
        return result;
    }


    public List<MultiLevelRelation> listByParentId(String parentId) {
        return this.multiLevelRelationDao.find("from MultiLevelRelation where parentId = ? ", parentId);
    }

    public void move(String id, String parentId, String position, String sourceParentId, String sourcePosition) {
        if ((parentId + "").equals((sourceParentId + ""))) { //同一个节点内变动
            if (new Integer(position) < new Integer(sourcePosition)) {
                //节点内向上移动，大于当前position，小于原始sourcePosition的节点，treeSeqNo + 1
                this.multiLevelRelationDao.batchExecute("update MultiLevelRelation set treeSeqNo = treeSeqNo + 1 where treeSeqNo >= ? and treeSeqNo <= ? and parentId = ?",
                        new Integer(position), new Integer(sourcePosition), parentId);
            } else {
                //节点内向上移动，大于原始sourcePosition，小于当前position的节点，treeSeqNo - 1
                this.multiLevelRelationDao.batchExecute("update MultiLevelRelation set treeSeqNo = treeSeqNo - 1 where treeSeqNo >= ? and treeSeqNo <= ? and parentId = ?",
                        new Integer(sourcePosition), new Integer(position), parentId);
            }
        } else {//跨节点变动
            //原始节点内大于原始sourcePosition的节点， treeSeqNo - 1
            this.multiLevelRelationDao.batchExecute("update MultiLevelRelation set treeSeqNo = treeSeqNo - 1 where treeSeqNo >= ? and parentId = ?",
                    new Integer(sourcePosition), sourceParentId);
            //新节点内大于position的节点， treeSeqNo + 1
            this.multiLevelRelationDao.batchExecute("update MultiLevelRelation set treeSeqNo = treeSeqNo + 1 where treeSeqNo >= ? and parentId = ?",
                    new Integer(position), parentId);
        }
        //更新当前节点
        MultiLevelRelation multiLevelRelation = this.get("relatedId", id);
        multiLevelRelation.setParentId(parentId);
        multiLevelRelation.setTreeSeqNo(new Integer(position));
        this.multiLevelRelationDao.saveOrUpdate(multiLevelRelation);

        this.updateTreePath(multiLevelRelation);
    }

    //更新当前节点以及其所有子节点的treePath
    private void updateTreePath(MultiLevelRelation relation) {
        MultiLevelRelation parent = this.get("relatedId", relation.getParentId());
        String parentTreePath = parent.getTreePath();
        relation.setTreePath(parentTreePath + relation.getId() + ">");
        relation.setDepth(parent.getDepth() + 1);
        this.multiLevelRelationDao.saveOrUpdate(relation);
        List<MultiLevelRelation> childList = this.listByParentId(relation.getId());
        for (MultiLevelRelation child : childList) {
            updateTreePath(child);
        }
    }

    public List<MultiLevelRelation> listMultiLevelByType(String type) {
        String hql = "from MultiLevelRelation where multiLevelType = ? and depth > 0 order by treePath,treeSeqNo";
        return this.multiLevelRelationDao.find(hql, type);
    }
}
