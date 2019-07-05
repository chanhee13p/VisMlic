const app = new Vue({
  el: '#app',

  data: {
    title: 'VisMLCV',
    sections: {
      ranking: {
        title: 'Ranking',
        sort_options: ['recall', 'presicion'],
      },
      confusion: {
        title: 'Confusion Matrix'
      },
      projection: {
        title: '2D Projection'
      },
      instances: {
        title: 'Instance Analysis'
      },
    },
    // data
    selecteddata: '',
    dataNames: ['mnist'],
    dataInfo: {
      mnist: {
        classNames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        modelNames: ['cnn', 'rfc_50', 'nn_3-layers', 'nn_5-layers', 'rfc_25', 'slp'],
        modelNamesALL: ['cnn', 'rfc_50', 'nn_3-layers', 'nn_5-layers', 'rfc_25', 'slp', 'rfc_10', 'nn_10-layers'],
      }
    },
    // models for visualization 
    models: {},
    selectedModel: {},
  },

  watch: {
    selecteddata: async function (newdata) {
      console.log(`모델 예측 데이터(${newdata})가 로드되었습니다.`)
      this.models = await this.getModels(
        this.dataInfo[newdata].modelNames,
        newdata
      );
    },
    models: function (newModels) {
      VisUtil.removeSvg('ranking');
      this.visualizeRanking(newModels, this.selecteddata);
      this.selectedModel = null;
    },
    selectedModel: function (newModel) {
      // TODO: updates confusion and projection.
      if (_.isNil(newModel)) {
        // remove 
        return;
      } else {
        // update
      }
    }
  },

  methods: {
    /**
     * 모델 이름들과 데이터 셋 이름을 입력받아 모델 예측 결과들을 반환한다.
     * @param {*} modelNames 
     * @param {*} dataName 
     */
    getModels: async function (modelNames, dataName) {
      const models = {};
      for (let modelName of modelNames) {
        models[modelName] = await this.getModel(modelName, dataName);
      }
      return models;
    },

    /**
     * 모델 이름 하나와 데이터 셋 이름을 입력받아 해당 모델의 예측 결과를 반환한다.
     * @param {*} modelName 
     * @param {*} dataName
     */
    getModel: async function (modelName, dataName) {
      const dirname = `../data/${dataName}/result/`;
      const filename = `${dataName}_${modelName}__result.json`;
      const response = await fetch(dirname + filename);
      return await response.json();
    },

    /**
     * 모델 예측 결과들을 입력 받아 랭킹을 시각화 한다. 
     * @param {*} models 
     */
    visualizeRanking: function (models, dataName) {
      // TODO: 랭킹 시각화 하기 
      // 필요한 함수는 vis.ranking에 만들어서 사용.
      console.log('=> 랭킹 시각화를 생성합니다. visualizeRanking()');
      console.log(dataName, models);

      // Set data infomaition
      const classes = this.dataInfo[dataName].classNames;
      const modelNames = _.keys(models);

      // Set svg root
      const root = d3.select('#vis-ranking');

      // Set width & height
      const WIDTH = 1488;
      const HEIGHT = 376;
      const LEFT_LEGEND_WIDTH = 140;
      const TOP_LEGEND_HEIGHT = 50;
      const RANKING_VIS_WIDHT = WIDTH - LEFT_LEGEND_WIDTH;
      const RANKING_VIS_HEIGHT = HEIGHT - TOP_LEGEND_HEIGHT;

      const CELL_WIDTH = RANKING_VIS_WIDHT / classes.length;
      const CELL_HEIGHT = RANKING_VIS_HEIGHT / (modelNames.length + 1);

      console.log(CELL_HEIGHT);

      // Draw legend
      // ==> Draw top legend
      VisUtil.text(root, 'Actual Classes', { x: WIDTH / 2, fill: '#333', size: '24px' });
      _.forEach(classes, (className, i) => {
        const x = LEFT_LEGEND_WIDTH + i * CELL_WIDTH + CELL_WIDTH / 2;
        VisUtil.text(root, className, { x, y: TOP_LEGEND_HEIGHT });
      });

      // ==> Darw left legend
      _.forEach(modelNames, (modelName, i) => {
        const y = TOP_LEGEND_HEIGHT + (i + 1) * CELL_HEIGHT;
        VisUtil.text(root, modelName, { x: 20, y, anchor: 'start' });
      });

    }
  },

  async mounted () {
    // set model prediction result data
    this.selecteddata = this.dataNames[0]; // minst
  },
})
